// Oracle: the 50-word text below ("token0 token1 ... token49") encodes
// (cl100k_base) to exactly 100 tokens, independently verified via the
// official Python tiktoken package run offline during authoring. Chunking
// those 100 tokens into groups of 7 yields 14 full chunks of 7 plus one
// final chunk of 2 (14*7 + 2 = 100), and concatenating the decoded chunks'
// text reproduces the original string exactly — also confirmed against the
// independent oracle.

import { ChunkTextRequest, ChunkTextResult } from '../gen/messages_pb';
import { chunkText } from './chunk_text';
import { testContext } from './testctx';

function req(text: string, encoding: string, maxTokensPerChunk: number): ChunkTextRequest {
  const r = new ChunkTextRequest();
  r.setText(text);
  r.setEncoding(encoding);
  r.setMaxTokensPerChunk(maxTokensPerChunk);
  return r;
}

function longText(): string {
  const words: string[] = [];
  for (let i = 0; i < 50; i++) {
    words.push('token' + i);
  }
  return words.join(' ');
}

describe('ChunkText', () => {
  it('matches the independent oracle chunk count/sizes and reassembles exactly', () => {
    const text = longText();
    const result = chunkText(testContext, req(text, 'cl100k_base', 7));
    expect(result).toBeInstanceOf(ChunkTextResult);
    expect(result.getError()).toBe('');

    const chunks = result.getChunksList();
    expect(chunks).toHaveLength(15);
    for (let i = 0; i < 14; i++) {
      expect(chunks[i].getTokenCount()).toBe(7);
    }
    expect(chunks[14].getTokenCount()).toBe(2);

    const reassembled = chunks.map((c) => c.getText()).join('');
    expect(reassembled).toBe(text);
  });

  it('every chunk is within the requested budget', () => {
    const text = longText();
    const result = chunkText(testContext, req(text, 'cl100k_base', 13));
    for (const chunk of result.getChunksList()) {
      expect(chunk.getTokenCount()).toBeLessThanOrEqual(13);
      expect(chunk.getTokenCount()).toBeGreaterThan(0);
    }
  });

  it('empty text yields zero chunks, not an error', () => {
    const result = chunkText(testContext, req('', 'cl100k_base', 10));
    expect(result.getError()).toBe('');
    expect(result.getChunksList()).toEqual([]);
  });

  it('text that already fits in one chunk yields exactly one chunk', () => {
    const result = chunkText(testContext, req('short text', 'cl100k_base', 1000));
    expect(result.getChunksList()).toHaveLength(1);
  });

  it('max_tokens_per_chunk of 0 returns INVALID_CHUNK_SIZE', () => {
    const result = chunkText(testContext, req('hello', 'cl100k_base', 0));
    expect(result.getError()).toBe('INVALID_CHUNK_SIZE');
  });

  it('negative max_tokens_per_chunk returns INVALID_CHUNK_SIZE', () => {
    const result = chunkText(testContext, req('hello', 'cl100k_base', -3));
    expect(result.getError()).toBe('INVALID_CHUNK_SIZE');
  });

  it('unrecognized encoding returns UNKNOWN_ENCODING', () => {
    const result = chunkText(testContext, req('hello', 'nope', 10));
    expect(result.getError()).toBe('UNKNOWN_ENCODING');
  });
});
