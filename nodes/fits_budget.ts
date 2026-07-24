import { FitsBudgetRequest, FitsBudgetResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { resolveEncoding, validateText } from './helpers';

/**
 * Check whether `text` fits within a token budget in one call — returns
 * both the boolean fits/doesn't-fit verdict and the actual token count. A
 * negative max_tokens, invalid UTF-8, or a
 * missing/unrecognized encoding returns a structured error.
 */
export function fitsBudget(ax: AxiomContext, input: FitsBudgetRequest): FitsBudgetResult {
  const result = new FitsBudgetResult();
  const text = input.getText();
  const maxTokens = input.getMaxTokens();

  const textErr = validateText(text);
  if (textErr) {
    result.setError(textErr);
    return result;
  }

  if (maxTokens < 0) {
    result.setError('NEGATIVE_MAX_TOKENS');
    return result;
  }

  const resolved = resolveEncoding(input.getEncoding());
  if (resolved.ok === false) {
    result.setError(resolved.error);
    return result;
  }

  const count = resolved.enc.encode(text).length;
  result.setCount(count);
  result.setFits(count <= maxTokens);
  return result;
}
