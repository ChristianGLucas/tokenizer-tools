// Oracle: "Hello, world! This is a test." is 9 tokens under cl100k_base,
// independently verified via the official Python tiktoken package (see
// count_tokens_test.ts / encode_test.ts).

import { FitsBudgetRequest, FitsBudgetResult } from '../gen/messages_pb';
import { fitsBudget } from './fits_budget';
import { testContext } from './testctx';

function req(text: string, encoding: string, maxTokens: number): FitsBudgetRequest {
  const r = new FitsBudgetRequest();
  r.setText(text);
  r.setEncoding(encoding);
  r.setMaxTokens(maxTokens);
  return r;
}

describe('FitsBudget', () => {
  const text = 'Hello, world! This is a test.'; // 9 tokens, cl100k_base

  it('reports fits=true and the correct count when text is within budget', () => {
    const result = fitsBudget(testContext, req(text, 'cl100k_base', 9));
    expect(result).toBeInstanceOf(FitsBudgetResult);
    expect(result.getError()).toBe('');
    expect(result.getFits()).toBe(true);
    expect(result.getCount()).toBe(9);
  });

  it('reports fits=false when text exceeds the budget by one token', () => {
    const result = fitsBudget(testContext, req(text, 'cl100k_base', 8));
    expect(result.getFits()).toBe(false);
    expect(result.getCount()).toBe(9);
  });

  it('reports fits=true with room to spare', () => {
    const result = fitsBudget(testContext, req(text, 'cl100k_base', 1000));
    expect(result.getFits()).toBe(true);
  });

  it('empty text always fits any non-negative budget', () => {
    const result = fitsBudget(testContext, req('', 'cl100k_base', 0));
    expect(result.getFits()).toBe(true);
    expect(result.getCount()).toBe(0);
  });

  it('a negative max_tokens returns NEGATIVE_MAX_TOKENS', () => {
    const result = fitsBudget(testContext, req(text, 'cl100k_base', -5));
    expect(result.getError()).toBe('NEGATIVE_MAX_TOKENS');
  });

  it('unrecognized encoding returns UNKNOWN_ENCODING', () => {
    const result = fitsBudget(testContext, req(text, 'nope', 10));
    expect(result.getError()).toBe('UNKNOWN_ENCODING');
  });
});
