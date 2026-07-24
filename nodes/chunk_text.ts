import { ChunkTextRequest, ChunkTextResult, TextChunk } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, validateText } from './helpers';

/**
 * Split `text` into an ordered sequence of chunks, each at most
 * `max_tokens_per_chunk` tokens under an explicit encoding — for feeding
 * long text into an embedding or RAG pipeline in size-bounded pieces. Chunk
 * boundaries align to token boundaries (never split mid-token);
 * concatenating the returned chunks' text reproduces the original text's
 * token sequence exactly. Empty text yields zero chunks (not an error). A
 * chunk size below 1, invalid UTF-8, or a
 * missing/unrecognized encoding returns a structured error.
 */
export function chunkText(ax: AxiomContext, input: ChunkTextRequest): ChunkTextResult {
  const result = new ChunkTextResult();
  const text = input.getText();
  const maxTokensPerChunk = input.getMaxTokensPerChunk();

  const textErr = validateText(text);
  if (textErr) {
    result.setError(textErr);
    return result;
  }

  if (maxTokensPerChunk < 1) {
    result.setError('INVALID_CHUNK_SIZE');
    return result;
  }

  const resolved = resolveEncoding(input.getEncoding());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  const ids = resolved.enc.encode(text);
  const chunks: TextChunk[] = [];
  for (let i = 0; i < ids.length; i += maxTokensPerChunk) {
    const slice = ids.slice(i, i + maxTokensPerChunk);
    const chunk = new TextChunk();
    chunk.setText(resolved.enc.decode(slice));
    chunk.setTokenCount(slice.length);
    chunks.push(chunk);
  }
  result.setChunksList(chunks);
  return result;
}
