// STRONGEST ORACLE IN THIS PACKAGE. `EXAMPLE_MESSAGES` below is reproduced
// verbatim from OpenAI's own cookbook notebook
// (openai-cookbook/examples/How_to_count_tokens_with_tiktoken.ipynb,
// fetched and inspected during authoring). The notebook's own committed
// output cell shows these exact counts were confirmed against a REAL
// OpenAI API response's `usage.prompt_tokens` field — not merely re-derived
// from tiktoken a second time:
//   gpt-4-0613 -> 129 prompt tokens (function AND live API agreed)
//   gpt-4o     -> 124 prompt tokens (function AND live API agreed)
// This is an independent oracle in the strongest sense available offline:
// a real production tokenizer's billed output, published by the library's
// own maintainer.

import { ChatTokensRequest, ChatTokensResult, ChatMessage } from '../gen/messages_pb';
import { countChatTokens } from './count_chat_tokens';
import { testContext } from './testctx';

function msg(role: string, content: string, name = ''): ChatMessage {
  const m = new ChatMessage();
  m.setRole(role);
  m.setContent(content);
  m.setName(name);
  return m;
}

function exampleMessages(): ChatMessage[] {
  return [
    msg('system', 'You are a helpful, pattern-following assistant that translates corporate jargon into plain English.'),
    msg('system', 'New synergies will help drive top-line growth.', 'example_user'),
    msg('system', 'Things working well together will increase revenue.', 'example_assistant'),
    msg(
      'system',
      "Let's circle back when we have more bandwidth to touch base on opportunities for increased leverage.",
      'example_user',
    ),
    msg('system', "Let's talk later when we're less busy about how to do better.", 'example_assistant'),
    msg('user', "This late pivot means we don't have time to boil the ocean for the client deliverable."),
  ];
}

function req(messages: ChatMessage[], model: string): ChatTokensRequest {
  const r = new ChatTokensRequest();
  r.setMessagesList(messages);
  r.setModel(model);
  return r;
}

describe('CountChatTokens', () => {
  it('matches the OpenAI-API-verified oracle for gpt-4-0613 (129 tokens)', () => {
    const result = countChatTokens(testContext, req(exampleMessages(), 'gpt-4-0613'));
    expect(result).toBeInstanceOf(ChatTokensResult);
    expect(result.getError()).toBe('');
    expect(result.getEncoding()).toBe('cl100k_base');
    expect(result.getCount()).toBe(129);
  });

  it('matches the OpenAI-API-verified oracle for gpt-4o (124 tokens)', () => {
    const result = countChatTokens(testContext, req(exampleMessages(), 'gpt-4o'));
    expect(result.getError()).toBe('');
    expect(result.getEncoding()).toBe('o200k_base');
    expect(result.getCount()).toBe(124);
  });

  it('resolves undated gpt-3.5-turbo to the same overhead rule as gpt-4-0613 (both 3/1/3)', () => {
    // gpt-3.5-turbo and gpt-4-0613 share cl100k_base and the same
    // documented 3/1/3 overhead, so they must produce the identical count
    // on this example conversation, per the cookbook.
    const result = countChatTokens(testContext, req(exampleMessages(), 'gpt-3.5-turbo'));
    expect(result.getCount()).toBe(129);
  });

  it("the deprecated gpt-3.5-turbo-0301's 4/-1 overhead differs from the standard 3/1 rule", () => {
    const standard = countChatTokens(testContext, req(exampleMessages(), 'gpt-4-0613'));
    const legacy0301 = countChatTokens(testContext, req(exampleMessages(), 'gpt-3.5-turbo-0301'));
    expect(legacy0301.getError()).toBe('');
    // 4 named messages in the example carry a `name` field; each one costs
    // (tokens_per_message + tokens_per_name) under 0301's 4/-1 vs the
    // standard rule's 3/1 -- a net +1 message overhead and -2 name
    // overhead per named message relative to the standard rule, with 2
    // unnamed messages contributing +1 each. Net delta = (4 msgs * (+1 -
    // 2)) + (2 msgs * (+1)) = -4 + 2 = -2.
    expect(legacy0301.getCount()).toBe(standard.getCount() - 2);
  });

  it('single-message request without a name field costs exactly tokens_per_message + content + priming', () => {
    const messages = [msg('user', 'hi')];
    const result = countChatTokens(testContext, req(messages, 'gpt-4-0613'));
    // "user" -> 1 token, "hi" -> 1 token (independently verified against
    // Python tiktoken cl100k_base), tokens_per_message=3, priming=3.
    expect(result.getCount()).toBe(3 + 1 + 1 + 3);
  });

  it('more than 500 messages returns TOO_MANY_MESSAGES', () => {
    const messages: ChatMessage[] = [];
    for (let i = 0; i < 501; i++) {
      messages.push(msg('user', 'hi'));
    }
    const result = countChatTokens(testContext, req(messages, 'gpt-4o'));
    expect(result.getError()).toBe('TOO_MANY_MESSAGES');
  });

  it('a single message over the 1 MiB cap returns MESSAGE_TOO_LARGE', () => {
    const messages = [msg('user', 'a'.repeat(1_048_577))];
    const result = countChatTokens(testContext, req(messages, 'gpt-4o'));
    expect(result.getError()).toBe('MESSAGE_TOO_LARGE');
  });

  it('missing model returns MISSING_MODEL', () => {
    const result = countChatTokens(testContext, req([msg('user', 'hi')], ''));
    expect(result.getError()).toBe('MISSING_MODEL');
  });

  it('a model without documented chat-overhead accounting returns UNKNOWN_MODEL', () => {
    // A legacy completions-only model was never a chat model and has no
    // documented per-message overhead rule.
    const result = countChatTokens(testContext, req([msg('user', 'hi')], 'text-davinci-003'));
    expect(result.getError()).toBe('UNKNOWN_MODEL');
  });

  it('an entirely unrecognized model name returns UNKNOWN_MODEL', () => {
    const result = countChatTokens(testContext, req([msg('user', 'hi')], 'not-a-real-model-xyz'));
    expect(result.getError()).toBe('UNKNOWN_MODEL');
  });
});
