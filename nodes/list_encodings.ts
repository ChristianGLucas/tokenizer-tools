import { ListEncodingsRequest, ListEncodingsResult, EncodingInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { SUPPORTED_ENCODINGS, EXAMPLE_MODELS_BY_ENCODING } from './helpers';

/**
 * List every BPE encoding this package supports (cl100k_base, o200k_base,
 * p50k_base, p50k_edit, r50k_base, gpt2), each with a representative sample
 * of the model names known to map to it — a directory node for discovering
 * what's available without needing to already know tiktoken's encoding
 * names. Takes no input.
 */
export function listEncodings(ax: AxiomContext, input: ListEncodingsRequest): ListEncodingsResult {
  const result = new ListEncodingsResult();
  const infos = SUPPORTED_ENCODINGS.map((name) => {
    const info = new EncodingInfo();
    info.setEncoding(name);
    info.setExampleModelsList(EXAMPLE_MODELS_BY_ENCODING[name]);
    return info;
  });
  result.setEncodingsList(infos);
  return result;
}
