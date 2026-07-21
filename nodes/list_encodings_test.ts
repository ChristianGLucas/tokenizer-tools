import { ListEncodingsRequest, ListEncodingsResult } from '../gen/messages_pb';
import { listEncodings } from './list_encodings';
import { testContext } from './testctx';

describe('ListEncodings', () => {
  it('lists exactly the 6 encodings this package bundles offline', () => {
    const result = listEncodings(testContext, new ListEncodingsRequest());
    expect(result).toBeInstanceOf(ListEncodingsResult);
    const names = result.getEncodingsList().map((e) => e.getEncoding());
    expect(names).toEqual(['cl100k_base', 'o200k_base', 'p50k_base', 'p50k_edit', 'r50k_base', 'gpt2']);
  });

  it('every encoding has at least one representative example model', () => {
    const result = listEncodings(testContext, new ListEncodingsRequest());
    for (const info of result.getEncodingsList()) {
      expect(info.getExampleModelsList().length).toBeGreaterThan(0);
    }
  });

  it('cl100k_base example models include gpt-4, matching the real mapping', () => {
    const result = listEncodings(testContext, new ListEncodingsRequest());
    const cl100k = result.getEncodingsList().find((e) => e.getEncoding() === 'cl100k_base');
    expect(cl100k?.getExampleModelsList()).toContain('gpt-4');
  });

  it('o200k_base example models include gpt-4o, matching the real mapping', () => {
    const result = listEncodings(testContext, new ListEncodingsRequest());
    const o200k = result.getEncodingsList().find((e) => e.getEncoding() === 'o200k_base');
    expect(o200k?.getExampleModelsList()).toContain('gpt-4o');
  });

  it('is deterministic: repeated calls return the identical list', () => {
    const a = listEncodings(testContext, new ListEncodingsRequest());
    const b = listEncodings(testContext, new ListEncodingsRequest());
    expect(a.toObject()).toEqual(b.toObject());
  });
});
