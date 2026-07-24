// The 100256 gap-ID fact below was cross-checked independently against the
// official Python `tiktoken` package during authoring: calling
// tiktoken.get_encoding("cl100k_base").decode([100256]) RAISES "Invalid
// token for decoding: 100256" — the authoritative implementation treats it
// as an error. js-tiktoken (the pure-JS port this package wraps) instead
// silently returns "" for that same ID with no error, and silently drops it
// out of a mixed valid/invalid array — confirmed directly against the
// library during authoring. This node's own validation (see helpers.ts
// findInvalidTokenIds) closes that gap: it reports INVALID_TOKEN_ID rather
// than silently under-producing text.

import { DecodeRequest, DecodeResult } from '../gen/messages_pb';
import { decode } from './decode';
import { testContext } from './testctx';

function req(tokenIds: number[], encoding: string): DecodeRequest {
  const r = new DecodeRequest();
  r.setTokenIdsList(tokenIds);
  r.setEncoding(encoding);
  return r;
}

describe('Decode', () => {
  it('matches the independent Python tiktoken oracle text exactly', () => {
    const result = decode(testContext, req([9906, 11, 1917, 0, 1115, 374, 264, 1296, 13], 'cl100k_base'));
    expect(result).toBeInstanceOf(DecodeResult);
    expect(result.getError()).toBe('');
    expect(result.getText()).toBe('Hello, world! This is a test.');
  });

  it('decodes a valid special token (endoftext, id 100257) correctly', () => {
    const result = decode(testContext, req([100257], 'cl100k_base'));
    expect(result.getError()).toBe('');
    expect(result.getText()).toBe('<|endoftext|>');
  });

  it('empty token_ids decodes to empty text, not an error', () => {
    const result = decode(testContext, req([], 'cl100k_base'));
    expect(result.getError()).toBe('');
    expect(result.getText()).toBe('');
  });

  it('an out-of-vocabulary ID (100256, the unused reserved gap) returns INVALID_TOKEN_ID', () => {
    const result = decode(testContext, req([100256], 'cl100k_base'));
    expect(result.getError()).toBe('INVALID_TOKEN_ID');
    expect(result.getText()).toBe('');
  });

  it('a mix of one valid and one invalid ID is a hard error, never a silently-shortened result', () => {
    // js-tiktoken itself would silently return just "Hello" here with no
    // error (verified against the library directly) — this node must not.
    const result = decode(testContext, req([9906, 999999999], 'cl100k_base'));
    expect(result.getError()).toBe('INVALID_TOKEN_ID');
  });

  it('a negative token ID returns INVALID_TOKEN_ID', () => {
    const result = decode(testContext, req([-1], 'cl100k_base'));
    expect(result.getError()).toBe('INVALID_TOKEN_ID');
  });

  it('decodes a large token_ids array without crashing (no element-count limit)', () => {
    const many = new Array(200_001).fill(9906);
    const result = decode(testContext, req(many, 'cl100k_base'));
    expect(result.getError()).toBe('');
    expect(result.getText().length).toBeGreaterThan(0);
  });

  it('missing encoding returns MISSING_ENCODING', () => {
    const result = decode(testContext, req([9906], ''));
    expect(result.getError()).toBe('MISSING_ENCODING');
  });

  it('unrecognized encoding returns UNKNOWN_ENCODING', () => {
    const result = decode(testContext, req([9906], 'not_real'));
    expect(result.getError()).toBe('UNKNOWN_ENCODING');
  });
});
