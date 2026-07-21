// Oracle: "Hello, world! This is a test." encodes (cl100k_base) to the
// independently-verified 9-token array [9906, 11, 1917, 0, 1115, 374, 264,
// 1296, 13] (see encode_test.ts). Truncating to the first 3 tokens decodes,
// per the official Python tiktoken package (run offline during authoring),
// to "Hello, world" (12 UTF-16 code units, vs. the original's 29) —
// tokens_dropped = 9 - 3 = 6, chars_dropped = 29 - 12 = 17.

import { TruncateRequest, TruncateResult } from '../gen/messages_pb';
import { truncate } from './truncate';
import { testContext } from './testctx';

function req(text: string, encoding: string, maxTokens: number): TruncateRequest {
  const r = new TruncateRequest();
  r.setText(text);
  r.setEncoding(encoding);
  r.setMaxTokens(maxTokens);
  return r;
}

describe('Truncate', () => {
  const text = 'Hello, world! This is a test.';

  it('matches the independent oracle when truncation actually removes tokens', () => {
    const result = truncate(testContext, req(text, 'cl100k_base', 3));
    expect(result).toBeInstanceOf(TruncateResult);
    expect(result.getError()).toBe('');
    expect(result.getTruncated()).toBe(true);
    expect(result.getTruncatedText()).toBe('Hello, world');
    expect(result.getTokensKept()).toBe(3);
    expect(result.getTokensDropped()).toBe(6);
    expect(result.getCharsDropped()).toBe(text.length - 'Hello, world'.length);
  });

  it('returns the original text unchanged when it already fits the budget', () => {
    const result = truncate(testContext, req(text, 'cl100k_base', 100));
    expect(result.getTruncated()).toBe(false);
    expect(result.getTruncatedText()).toBe(text);
    expect(result.getTokensKept()).toBe(9);
    expect(result.getTokensDropped()).toBe(0);
    expect(result.getCharsDropped()).toBe(0);
  });

  it('exact-fit budget (max_tokens == token count) is not truncated', () => {
    const result = truncate(testContext, req(text, 'cl100k_base', 9));
    expect(result.getTruncated()).toBe(false);
    expect(result.getTokensDropped()).toBe(0);
  });

  it('max_tokens=0 drops everything down to empty text', () => {
    const result = truncate(testContext, req(text, 'cl100k_base', 0));
    expect(result.getTruncated()).toBe(true);
    expect(result.getTruncatedText()).toBe('');
    expect(result.getTokensKept()).toBe(0);
    expect(result.getTokensDropped()).toBe(9);
  });

  it('a negative max_tokens returns NEGATIVE_MAX_TOKENS', () => {
    const result = truncate(testContext, req(text, 'cl100k_base', -1));
    expect(result.getError()).toBe('NEGATIVE_MAX_TOKENS');
  });

  it('missing encoding returns MISSING_ENCODING', () => {
    const result = truncate(testContext, req(text, '', 3));
    expect(result.getError()).toBe('MISSING_ENCODING');
  });
});
