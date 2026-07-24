// Model->encoding resolution and count oracles derived independently from
// the official Python `tiktoken` package's own tiktoken.encoding_for_model()
// and encode(), run offline during authoring.

import { TextModelRequest, CountForModelResult } from '../gen/messages_pb';
import { countTokensForModel } from './count_tokens_for_model';
import { testContext } from './testctx';

function req(text: string, model: string): TextModelRequest {
  const r = new TextModelRequest();
  r.setText(text);
  r.setModel(model);
  return r;
}

describe('CountTokensForModel', () => {
  it('resolves gpt-4o to o200k_base and matches the independent oracle count', () => {
    const result = countTokensForModel(testContext, req('Hello, world!', 'gpt-4o'));
    expect(result).toBeInstanceOf(CountForModelResult);
    expect(result.getError()).toBe('');
    expect(result.getEncoding()).toBe('o200k_base');
    expect(result.getCount()).toBe(4);
  });

  it('resolves gpt-4 to cl100k_base and matches the independent oracle count', () => {
    const result = countTokensForModel(testContext, req('Hello, world! This is a test.', 'gpt-4'));
    expect(result.getEncoding()).toBe('cl100k_base');
    expect(result.getCount()).toBe(9);
  });

  it('resolves a legacy base model (davinci) to r50k_base', () => {
    const result = countTokensForModel(
      testContext,
      req('The quick brown fox jumps over the lazy dog.', 'davinci'),
    );
    expect(result.getEncoding()).toBe('r50k_base');
    expect(result.getCount()).toBe(10);
  });

  it('missing model returns MISSING_MODEL', () => {
    const result = countTokensForModel(testContext, req('hello', ''));
    expect(result.getError()).toBe('MISSING_MODEL');
  });

  it('unrecognized model name returns UNKNOWN_MODEL, never a guessed encoding', () => {
    const result = countTokensForModel(testContext, req('hello', 'not-a-real-model-xyz'));
    expect(result.getError()).toBe('UNKNOWN_MODEL');
    expect(result.getEncoding()).toBe('');
  });

  it('counts a large input without crashing (no payload-size limit)', () => {
    const large = 'a'.repeat(1_048_577);
    const result = countTokensForModel(testContext, req(large, 'gpt-4o'));
    expect(result.getError()).toBe('');
    expect(result.getCount()).toBeGreaterThan(0);
  });
});
