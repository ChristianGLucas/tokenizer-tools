import { TextEncodingRequest, CountResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, validateText } from './helpers';

/**
 * Count how many BPE tokens `text` encodes to under an explicit encoding
 * (cl100k_base, o200k_base, p50k_base, p50k_edit, r50k_base, gpt2). Text
 * over 1 MiB, invalid UTF-8, a missing encoding, or an unrecognized
 * encoding name returns a structured error instead of a count.
 */
export function countTokens(ax: AxiomContext, input: TextEncodingRequest): CountResult {
  const result = new CountResult();
  const text = input.getText();

  const textErr = validateText(text);
  if (textErr) {
    result.setError(textErr);
    return result;
  }

  const resolved = resolveEncoding(input.getEncoding());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  result.setCount(resolved.enc.encode(text).length);
  return result;
}
