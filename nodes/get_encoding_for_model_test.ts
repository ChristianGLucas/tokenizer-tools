// Model->encoding mappings below were cross-checked independently against
// the official Python tiktoken package's tiktoken.encoding_for_model(),
// run offline during authoring.

import { ModelRequest, EncodingForModelResult } from '../gen/messages_pb';
import { getEncodingForModel } from './get_encoding_for_model';
import { testContext } from './testctx';

function req(model: string): ModelRequest {
  const r = new ModelRequest();
  r.setModel(model);
  return r;
}

describe('GetEncodingForModel', () => {
  it('matches the independent oracle: gpt-4o -> o200k_base', () => {
    const result = getEncodingForModel(testContext, req('gpt-4o'));
    expect(result).toBeInstanceOf(EncodingForModelResult);
    expect(result.getError()).toBe('');
    expect(result.getEncoding()).toBe('o200k_base');
  });

  it('matches the independent oracle: gpt-4 -> cl100k_base', () => {
    const result = getEncodingForModel(testContext, req('gpt-4'));
    expect(result.getEncoding()).toBe('cl100k_base');
  });

  it('matches the independent oracle: gpt-3.5-turbo -> cl100k_base', () => {
    const result = getEncodingForModel(testContext, req('gpt-3.5-turbo'));
    expect(result.getEncoding()).toBe('cl100k_base');
  });

  it('matches the independent oracle: davinci -> r50k_base', () => {
    const result = getEncodingForModel(testContext, req('davinci'));
    expect(result.getEncoding()).toBe('r50k_base');
  });

  it('matches the independent oracle: text-davinci-003 -> p50k_base', () => {
    const result = getEncodingForModel(testContext, req('text-davinci-003'));
    expect(result.getEncoding()).toBe('p50k_base');
  });

  it('missing model returns MISSING_MODEL', () => {
    const result = getEncodingForModel(testContext, req(''));
    expect(result.getError()).toBe('MISSING_MODEL');
  });

  it('unrecognized model name returns UNKNOWN_MODEL, never a guess', () => {
    const result = getEncodingForModel(testContext, req('totally-made-up-model'));
    expect(result.getError()).toBe('UNKNOWN_MODEL');
    expect(result.getEncoding()).toBe('');
  });
});
