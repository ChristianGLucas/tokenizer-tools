import { TextEncodingRequest, EncodeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, validateText } from './helpers';

/**
 * Encode `text` into its ordered array of BPE token IDs under an explicit
 * encoding. Decoding the returned token_ids under the same encoding (via
 * Decode) reproduces the original text exactly. Text over 1 MiB, invalid
 * UTF-8, a missing encoding, or an unrecognized encoding name returns a
 * structured error.
 */
export function encode(ax: AxiomContext, input: TextEncodingRequest): EncodeResult {
  const result = new EncodeResult();
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

  const ids = resolved.enc.encode(text);
  result.setTokenIdsList(ids);
  result.setCount(ids.length);
  return result;
}
