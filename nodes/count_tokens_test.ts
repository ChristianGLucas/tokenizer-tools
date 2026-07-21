// Oracle values below were derived independently from the OFFICIAL Python
// `tiktoken` package (PyPI, Rust-backed — a separate implementation from the
// js-tiktoken pure-JS port this package wraps), run offline during
// authoring, e.g.:
//   tiktoken.get_encoding("cl100k_base").encode("Hello, world! This is a
//   test.") -> 9 tokens
// This is a genuine second-implementation cross-check, not a round-trip
// through the same library.

import { TextEncodingRequest, CountResult } from '../gen/messages_pb';
import { countTokens } from './count_tokens';
import { testContext } from './testctx';

function req(text: string, encoding: string): TextEncodingRequest {
  const r = new TextEncodingRequest();
  r.setText(text);
  r.setEncoding(encoding);
  return r;
}

describe('CountTokens', () => {
  it('matches the independent Python tiktoken oracle for cl100k_base', () => {
    const result = countTokens(testContext, req('Hello, world! This is a test.', 'cl100k_base'));
    expect(result).toBeInstanceOf(CountResult);
    expect(result.getError()).toBe('');
    expect(result.getCount()).toBe(9);
  });

  it('matches the independent oracle for o200k_base', () => {
    const result = countTokens(testContext, req('Hello, world!', 'o200k_base'));
    expect(result.getCount()).toBe(4);
  });

  it('matches the independent oracle for p50k_base', () => {
    const result = countTokens(testContext, req('The quick brown fox jumps over the lazy dog.', 'p50k_base'));
    expect(result.getCount()).toBe(10);
  });

  it('matches the independent oracle for r50k_base', () => {
    const result = countTokens(testContext, req('The quick brown fox jumps over the lazy dog.', 'r50k_base'));
    expect(result.getCount()).toBe(10);
  });

  it('matches the independent oracle for p50k_edit', () => {
    const result = countTokens(testContext, req('The quick brown fox jumps over the lazy dog.', 'p50k_edit'));
    expect(result.getCount()).toBe(10);
  });

  it('matches the independent oracle for gpt2', () => {
    const result = countTokens(testContext, req('The quick brown fox jumps over the lazy dog.', 'gpt2'));
    expect(result.getCount()).toBe(10);
  });

  it('handles unicode and emoji (multi-byte UTF-8), matching the independent oracle', () => {
    const result = countTokens(testContext, req('日本語のテスト 🎉', 'cl100k_base'));
    expect(result.getCount()).toBe(10);
  });

  it('empty text is valid input, not an error, and encodes to zero tokens', () => {
    const result = countTokens(testContext, req('', 'cl100k_base'));
    expect(result.getError()).toBe('');
    expect(result.getCount()).toBe(0);
  });

  it('missing encoding returns MISSING_ENCODING, not a crash', () => {
    const result = countTokens(testContext, req('hello', ''));
    expect(result.getError()).toBe('MISSING_ENCODING');
    expect(result.getCount()).toBe(0);
  });

  it('unrecognized encoding name returns UNKNOWN_ENCODING, never a silent fallback', () => {
    const result = countTokens(testContext, req('hello', 'not_a_real_encoding'));
    expect(result.getError()).toBe('UNKNOWN_ENCODING');
  });

  it('text over the 1 MiB cap returns TEXT_TOO_LARGE instead of hanging on a huge encode', () => {
    const huge = 'a'.repeat(1_048_577);
    const result = countTokens(testContext, req(huge, 'cl100k_base'));
    expect(result.getError()).toBe('TEXT_TOO_LARGE');
  });

  it('an unpaired UTF-16 surrogate returns INVALID_UTF8 rather than mangled output', () => {
    const badText = 'abc\uD800def'; // lone high surrogate, no matching low surrogate
    const result = countTokens(testContext, req(badText, 'cl100k_base'));
    expect(result.getError()).toBe('INVALID_UTF8');
  });

  it('is deterministic: identical input yields identical output across calls', () => {
    const a = countTokens(testContext, req('determinism check', 'cl100k_base'));
    const b = countTokens(testContext, req('determinism check', 'cl100k_base'));
    expect(a.getCount()).toBe(b.getCount());
  });
});
