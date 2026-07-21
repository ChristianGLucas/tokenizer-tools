import { DecodeRequest, DecodeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, findInvalidTokenIds, MAX_TOKEN_IDS } from './helpers';

/**
 * Decode an array of BPE token IDs back into text under an explicit
 * encoding — the inverse of Encode. Every ID is validated against the
 * resolved encoding's actual vocabulary before decoding: an ID outside that
 * vocabulary returns a structured INVALID_TOKEN_ID error rather than the
 * underlying js-tiktoken library's own behavior of silently dropping
 * unrecognized IDs from the output. More than 200,000 token_ids, or a
 * missing/unrecognized encoding, also returns a structured error.
 */
export function decode(ax: AxiomContext, input: DecodeRequest): DecodeResult {
  const result = new DecodeResult();
  const ids = input.getTokenIdsList();

  if (ids.length > MAX_TOKEN_IDS) {
    result.setError('TOO_MANY_TOKENS');
    return result;
  }

  const resolved = resolveEncoding(input.getEncoding());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  const invalid = findInvalidTokenIds(resolved.enc, ids);
  if (invalid.length > 0) {
    result.setError('INVALID_TOKEN_ID');
    return result;
  }

  result.setText(resolved.enc.decode(ids));
  return result;
}
