import { TextModelRequest, CountForModelResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveModel, validateText } from './helpers';

/**
 * Count how many BPE tokens `text` encodes to for a named OpenAI model
 * (e.g. "gpt-4o", "gpt-4", "gpt-3.5-turbo"), resolving the model name to
 * its encoding internally so callers never need to know the encoding
 * themselves. Also returns which encoding was resolved. An unrecognized
 * model name, a missing model, or text over 1 MiB / not valid UTF-8 returns
 * a structured error instead of a count.
 */
export function countTokensForModel(ax: AxiomContext, input: TextModelRequest): CountForModelResult {
  const result = new CountForModelResult();
  const text = input.getText();

  const textErr = validateText(text);
  if (textErr) {
    result.setError(textErr);
    return result;
  }

  const resolved = resolveModel(input.getModel());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  result.setCount(resolved.enc.encode(text).length);
  result.setEncoding(resolved.encodingName);
  return result;
}
