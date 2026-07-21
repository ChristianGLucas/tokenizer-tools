import { getEncoding, getEncodingNameForModel, Tiktoken } from 'js-tiktoken';

// ---------------------------------------------------------------------------
// Shared bounds. Checked on the raw input before any parsing/encoding work.
// ---------------------------------------------------------------------------
export const MAX_TEXT_BYTES = 1_048_576; // 1 MiB
export const MAX_TOKEN_IDS = 200_000;
export const MAX_CHAT_MESSAGES = 500;
export const MAX_MESSAGE_BYTES = 1_048_576; // 1 MiB per message
export const MAX_CHAT_REQUEST_BYTES = 4 * 1_048_576; // 4 MiB combined

export const SUPPORTED_ENCODINGS = [
  'cl100k_base',
  'o200k_base',
  'p50k_base',
  'p50k_edit',
  'r50k_base',
  'gpt2',
] as const;
export type SupportedEncoding = (typeof SUPPORTED_ENCODINGS)[number];

function isSupportedEncoding(name: string): name is SupportedEncoding {
  return (SUPPORTED_ENCODINGS as readonly string[]).includes(name);
}

// A representative (non-exhaustive) sample of model names per encoding, for
// ListEncodings' discovery output. GetEncodingForModel is the authoritative
// per-model resolver — this list is illustrative only.
export const EXAMPLE_MODELS_BY_ENCODING: Record<SupportedEncoding, string[]> = {
  cl100k_base: ['gpt-4', 'gpt-4-32k', 'gpt-3.5-turbo', 'text-embedding-ada-002'],
  o200k_base: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o3', 'gpt-4.1', 'gpt-5'],
  p50k_base: ['text-davinci-003', 'text-davinci-002', 'code-davinci-002'],
  p50k_edit: ['text-davinci-edit-001', 'code-davinci-edit-001'],
  r50k_base: ['davinci', 'curie', 'babbage', 'ada'],
  gpt2: ['gpt2'],
};

// One Tiktoken instance per encoding, built lazily and cached — the rank
// tables are static bundled data, so reusing the instance across calls is
// safe (no shared mutable state affects the outcome; every encode/decode
// call is still a pure function of its own arguments).
const encodingCache = new Map<SupportedEncoding, Tiktoken>();
function getCachedEncoding(name: SupportedEncoding): Tiktoken {
  let enc = encodingCache.get(name);
  if (!enc) {
    enc = getEncoding(name);
    encodingCache.set(name, enc);
  }
  return enc;
}

export type EncodingResolution = { ok: true; enc: Tiktoken; name: SupportedEncoding } | { ok: false; error: string };

// Resolve an explicit encoding-name field. Empty -> MISSING_ENCODING;
// anything not in SUPPORTED_ENCODINGS -> UNKNOWN_ENCODING (never a silent
// fallback to a default encoding).
export function resolveEncoding(encoding: string): EncodingResolution {
  if (!encoding) {
    return { ok: false, error: 'MISSING_ENCODING' };
  }
  if (!isSupportedEncoding(encoding)) {
    return { ok: false, error: 'UNKNOWN_ENCODING' };
  }
  return { ok: true, enc: getCachedEncoding(encoding), name: encoding };
}

export type ModelResolution = { ok: true; enc: Tiktoken; encodingName: SupportedEncoding } | { ok: false; error: string };

// Resolve a model name field to its encoding via js-tiktoken's own model
// table. Empty -> MISSING_MODEL; unrecognized -> UNKNOWN_MODEL.
export function resolveModel(model: string): ModelResolution {
  if (!model) {
    return { ok: false, error: 'MISSING_MODEL' };
  }
  let name: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name = getEncodingNameForModel(model as any);
  } catch {
    return { ok: false, error: 'UNKNOWN_MODEL' };
  }
  if (!isSupportedEncoding(name)) {
    // Defensive: js-tiktoken's model table should only ever resolve to one
    // of the encodings we bundle, but never trust that silently.
    return { ok: false, error: 'UNKNOWN_MODEL' };
  }
  return { ok: true, enc: getCachedEncoding(name), encodingName: name };
}

// Byte length of a JS string as UTF-8, matching how the platform will have
// measured `text` on the wire.
export function utf8ByteLength(s: string): number {
  return Buffer.byteLength(s, 'utf8');
}

// True when `s` contains an unpaired UTF-16 surrogate — a string that did
// not originate from valid UTF-8 (or valid Unicode text at all) and would
// otherwise be silently mangled (replaced with U+FFFD) by TextEncoder/
// Buffer's UTF-8 encoder rather than rejected.
export function hasInvalidUtf16(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate: must be followed by a low surrogate.
      const next = s.charCodeAt(i + 1);
      if (Number.isNaN(next) || next < 0xdc00 || next > 0xdfff) {
        return true;
      }
      i++; // consumed the pair
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      // Unpaired low surrogate.
      return true;
    }
  }
  return false;
}

// Validate `text` against the shared size/encoding bounds. Returns an error
// code, or '' when text is valid.
export function validateText(text: string): string {
  if (hasInvalidUtf16(text)) {
    return 'INVALID_UTF8';
  }
  if (utf8ByteLength(text) > MAX_TEXT_BYTES) {
    return 'TEXT_TOO_LARGE';
  }
  return '';
}

// Every ID in `ids` that is NOT a valid token under `enc` — i.e. neither an
// ordinary BPE rank nor one of the encoding's special tokens. js-tiktoken's
// own decode() silently drops IDs like these instead of erroring (confirmed
// directly against the library during authoring: decode([validId,
// 999999999]) returns only the valid token's text, with no indication
// anything was dropped) — so callers of this helper must treat any non-empty
// result as a hard error rather than pass the IDs to decode() and hope.
export function findInvalidTokenIds(enc: Tiktoken, ids: number[]): number[] {
  const invalid: number[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textMap: Map<number, unknown> = (enc as any).textMap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inverseSpecialTokens: Record<number, unknown> = (enc as any).inverseSpecialTokens;
  for (const id of ids) {
    if (!Number.isInteger(id)) {
      invalid.push(id);
      continue;
    }
    const valid = textMap.has(id) || inverseSpecialTokens[id] !== undefined;
    if (!valid) {
      invalid.push(id);
    }
  }
  return invalid;
}

// ---------------------------------------------------------------------------
// Chat-token accounting (OpenAI's documented "num_tokens_from_messages").
//
// Reproduces the reference algorithm from OpenAI's own cookbook
// (openai-cookbook/examples/How_to_count_tokens_with_tiktoken.ipynb, fetched
// and inspected during authoring): a fixed per-message overhead, a
// per-`name`-field overhead, and a fixed assistant-priming suffix, all
// layered on top of each field's own raw token count. Verified during
// authoring against the notebook's own worked example, whose counts the
// notebook confirms against a real OpenAI API response (129 tokens for
// gpt-4-0613, 124 for gpt-4o, on its 6-message example conversation) — see
// count_chat_tokens_test.ts for the reproduced oracle.
// ---------------------------------------------------------------------------

export type ChatOverhead = {
  tokensPerMessage: number;
  tokensPerName: number;
  priming: number;
  resolvedModel: string;
};

// Models with an explicitly documented 3/1 overhead in the cookbook.
const EXPLICIT_3_1_MODELS = new Set([
  'gpt-3.5-turbo-0125',
  'gpt-4-0314',
  'gpt-4-32k-0314',
  'gpt-4-0613',
  'gpt-4-32k-0613',
  'gpt-4o-mini-2024-07-18',
  'gpt-4o-2024-08-06',
]);

// Resolve a (possibly undated) model name to its documented chat-overhead
// parameters, mirroring the cookbook's own cascading resolution: an exact
// dated match is used directly; an undated family name (e.g. "gpt-4o") is
// mapped to that family's latest documented dated snapshot. Returns null
// when the model isn't covered by any documented chat-overhead rule (e.g.
// it isn't a chat-completions model at all).
export function resolveChatOverhead(model: string): ChatOverhead | null {
  if (EXPLICIT_3_1_MODELS.has(model)) {
    return { tokensPerMessage: 3, tokensPerName: 1, priming: 3, resolvedModel: model };
  }
  if (model === 'gpt-3.5-turbo-0301') {
    return { tokensPerMessage: 4, tokensPerName: -1, priming: 3, resolvedModel: model };
  }
  if (model.includes('gpt-3.5-turbo')) {
    return resolveChatOverhead('gpt-3.5-turbo-0125');
  }
  if (model.includes('gpt-4o-mini')) {
    return resolveChatOverhead('gpt-4o-mini-2024-07-18');
  }
  if (model.includes('gpt-4o')) {
    return resolveChatOverhead('gpt-4o-2024-08-06');
  }
  if (model.includes('gpt-4')) {
    return resolveChatOverhead('gpt-4-0613');
  }
  return null;
}
