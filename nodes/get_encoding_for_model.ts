import { ModelRequest, EncodingForModelResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveModel } from './helpers';

/**
 * Resolve a named OpenAI model (e.g. "gpt-4o", "gpt-4", "text-davinci-003")
 * to the BPE encoding it uses (e.g. "o200k_base", "cl100k_base",
 * "p50k_base"), without tokenizing any text. A missing or unrecognized
 * model name returns a structured error.
 */
export function getEncodingForModel(ax: AxiomContext, input: ModelRequest): EncodingForModelResult {
  const result = new EncodingForModelResult();
  const resolved = resolveModel(input.getModel());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }
  result.setEncoding(resolved.encodingName);
  return result;
}
