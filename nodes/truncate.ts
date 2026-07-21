import { TruncateRequest, TruncateResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, validateText } from './helpers';

/**
 * Cut `text` down to at most `max_tokens` tokens under an explicit
 * encoding, returning the truncated text plus exactly how many tokens and
 * UTF-16 characters were dropped. Returns the original text unchanged
 * (truncated=false, both dropped counts 0) when it already fits.
 * Truncation always keeps a token-boundary-aligned prefix (never splits a
 * token's bytes). A negative max_tokens, text over 1 MiB, invalid UTF-8, or
 * a missing/unrecognized encoding returns a structured error.
 */
export function truncate(ax: AxiomContext, input: TruncateRequest): TruncateResult {
  const result = new TruncateResult();
  const text = input.getText();
  const maxTokens = input.getMaxTokens();

  const textErr = validateText(text);
  if (textErr) {
    result.setError(textErr);
    return result;
  }

  if (maxTokens < 0) {
    result.setError('NEGATIVE_MAX_TOKENS');
    return result;
  }

  const resolved = resolveEncoding(input.getEncoding());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  const ids = resolved.enc.encode(text);
  if (ids.length <= maxTokens) {
    result.setTruncatedText(text);
    result.setTruncated(false);
    result.setTokensKept(ids.length);
    result.setTokensDropped(0);
    result.setCharsDropped(0);
    return result;
  }

  const keptIds = ids.slice(0, maxTokens);
  const truncatedText = resolved.enc.decode(keptIds);
  result.setTruncatedText(truncatedText);
  result.setTruncated(true);
  result.setTokensKept(keptIds.length);
  result.setTokensDropped(ids.length - keptIds.length);
  result.setCharsDropped(text.length - truncatedText.length);
  return result;
}
