import type { AnyMatcher } from 'core/matchers/types';
import { errorWhen, matchingError } from 'core/MatchingError';
import type { MatchingError } from 'core/types';

export const testExactMatch = (
  matcher: AnyMatcher,
  actual: unknown
): Array<MatchingError> => [
  ...errorWhen(
    actual !== matcher['case:matcher:example'],
    matchingError(
      matcher,
      `'${actual}' (${typeof actual}) is not exactly equal to '${
        matcher['case:matcher:example']
      }' (${typeof matcher['case:matcher:example']})`,
      actual
    )
  ),
];