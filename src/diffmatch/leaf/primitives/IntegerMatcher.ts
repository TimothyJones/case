import { errorWhen, matchingError, combineResults } from 'entities/results';
import type {
  MatchingError,
  MatcherExecutor,
  MatchContext,
  CoreIntegerMatch,
  INTEGER_MATCH_TYPE,
} from 'entities/types';

const check = (
  matcher: CoreIntegerMatch,
  matchContext: MatchContext,
  actual: unknown
): Array<MatchingError> =>
  combineResults(
    errorWhen(
      !Number.isInteger(actual),
      matchingError(matcher, 'Expected an integer', actual, matchContext)
    )
  );

export const IntegerMatcher: MatcherExecutor<typeof INTEGER_MATCH_TYPE> = {
  check,
  strip: (matcher: CoreIntegerMatch) => matcher['case:matcher:example'],
};
