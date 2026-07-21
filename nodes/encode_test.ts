// The exact token-ID array below was derived independently from the
// official Python `tiktoken` package's encode(), run offline during
// authoring: tiktoken.get_encoding("cl100k_base").encode("Hello, world!
// This is a test.") -> [9906, 11, 1917, 0, 1115, 374, 264, 1296, 13].

import { TextEncodingRequest, EncodeResult } from '../gen/messages_pb';
import { encode } from './encode';
import { decode } from './decode';
import { DecodeRequest } from '../gen/messages_pb';
import { testContext } from './testctx';

function req(text: string, encoding: string): TextEncodingRequest {
  const r = new TextEncodingRequest();
  r.setText(text);
  r.setEncoding(encoding);
  return r;
}

describe('Encode', () => {
  it('matches the independent Python tiktoken oracle token-ID array exactly', () => {
    const result = encode(testContext, req('Hello, world! This is a test.', 'cl100k_base'));
    expect(result).toBeInstanceOf(EncodeResult);
    expect(result.getError()).toBe('');
    expect(result.getTokenIdsList()).toEqual([9906, 11, 1917, 0, 1115, 374, 264, 1296, 13]);
    expect(result.getCount()).toBe(9);
  });

  it('round-trips through Decode back to the exact original text', () => {
    const original = 'Round-trip check: café, naïve, 日本語, emoji 🚀.';
    const encoded = encode(testContext, req(original, 'cl100k_base'));
    expect(encoded.getError()).toBe('');

    const decReq = new DecodeRequest();
    decReq.setTokenIdsList(encoded.getTokenIdsList());
    decReq.setEncoding('cl100k_base');
    const decoded = decode(testContext, decReq);

    expect(decoded.getError()).toBe('');
    expect(decoded.getText()).toBe(original);
  });

  it('empty text encodes to an empty array, not an error', () => {
    const result = encode(testContext, req('', 'cl100k_base'));
    expect(result.getError()).toBe('');
    expect(result.getTokenIdsList()).toEqual([]);
    expect(result.getCount()).toBe(0);
  });

  it('missing encoding returns MISSING_ENCODING', () => {
    const result = encode(testContext, req('hello', ''));
    expect(result.getError()).toBe('MISSING_ENCODING');
  });

  it('unrecognized encoding name returns UNKNOWN_ENCODING', () => {
    const result = encode(testContext, req('hello', 'xyz_not_real'));
    expect(result.getError()).toBe('UNKNOWN_ENCODING');
  });

  it('text over the 1 MiB cap returns TEXT_TOO_LARGE', () => {
    const huge = 'a'.repeat(1_048_577);
    const result = encode(testContext, req(huge, 'cl100k_base'));
    expect(result.getError()).toBe('TEXT_TOO_LARGE');
  });
});
