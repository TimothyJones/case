import type { JsonExactPrimitiveMatcher } from 'core/matchers/types';
import { matchingError } from 'core/MatchingError';
import type { MatchingError } from 'core/types';

export const JsonExact = (
  matcher: JsonExactPrimitiveMatcher,
  actual: unknown
): Array<MatchingError> => {
  if (actual !== null) {
    return [matchingError(matcher, `'${actual}' is not null`, actual)];
  }
  return [];
};