import { ChatTokensRequest, ChatTokensResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  resolveModel,
  resolveChatOverhead,
  hasInvalidUtf16,
} from './helpers';

/**
 * Count how many tokens a chat-message array (role/name/content per
 * message) would cost for a named model, implementing OpenAI's documented
 * "num_tokens_from_messages" accounting: each message's role/name/content
 * tokens, plus the model family's fixed per-message overhead, plus a
 * per-message adjustment when `name` is set, plus the fixed per-reply
 * priming tokens every chat completion adds — not just the sum of each
 * message's raw content token count, which undercounts the real request.
 * Covers chat-completion model families with documented overhead
 * (gpt-3.5-turbo, gpt-4, gpt-4-32k, gpt-4o, gpt-4o-mini); a model without
 * that documented accounting returns UNKNOWN_MODEL. A missing model also
 * returns a structured error.
 */
export function countChatTokens(ax: AxiomContext, input: ChatTokensRequest): ChatTokensResult {
  const result = new ChatTokensResult();
  const messages = input.getMessagesList();
  const model = input.getModel();

  for (const m of messages) {
    if (hasInvalidUtf16(m.getRole()) || hasInvalidUtf16(m.getName()) || hasInvalidUtf16(m.getContent())) {
      result.setError('INVALID_UTF8');
      return result;
    }
  }

  if (!model) {
    result.setError('MISSING_MODEL');
    return result;
  }

  const overhead = resolveChatOverhead(model);
  if (!overhead) {
    result.setError('UNKNOWN_MODEL');
    return result;
  }

  const resolvedModelInfo = resolveModel(overhead.resolvedModel);
  if (resolvedModelInfo.ok === false) {
    // Defensive: every resolvedModel produced by resolveChatOverhead is a
    // real OpenAI model name js-tiktoken's own table recognizes.
    result.setError('UNKNOWN_MODEL');
    return result;
  }
  const enc = resolvedModelInfo.enc;

  let numTokens = 0;
  for (const m of messages) {
    numTokens += overhead.tokensPerMessage;
    numTokens += enc.encode(m.getRole()).length;
    numTokens += enc.encode(m.getContent()).length;
    const name = m.getName();
    if (name !== '') {
      numTokens += enc.encode(name).length;
      numTokens += overhead.tokensPerName;
    }
  }
  numTokens += overhead.priming;

  result.setCount(numTokens);
  result.setEncoding(resolvedModelInfo.encodingName);
  return result;
}
