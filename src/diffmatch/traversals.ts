import type { MatchContext } from 'entities/context/types';
import { CaseCoreError } from 'entities/CaseCoreError';
import { foldIntoContext } from 'entities/context';
import { inferMatcher } from 'diffmatch/inferMatcher';

import type {
  MatcherExecutor,
  AnyCaseNodeType,
  CaseNodeFor,
  AnyLeafOrStructure,
} from 'entities/types';
import { MatcherExecutors } from './MatcherExecutors';

const getExecutor = <T extends AnyCaseNodeType>(
  matcherOrData: CaseNodeFor<T> | AnyLeafOrStructure,
  parentMatchContext: MatchContext
) => {
  const matcher = inferMatcher<T>(matcherOrData) as CaseNodeFor<T>;
  const matchContext = foldIntoContext(matcher, parentMatchContext);

  const executor: MatcherExecutor<T> =
    MatcherExecutors[matcher['case:matcher:type'] as T];
  if (!executor) {
    throw new CaseCoreError(
      `Missing executor for matcher type '${matcher['case:matcher:type']}'`
    );
  }
  return {
    check: (actual: unknown) => executor.check(matcher, matchContext, actual),
    strip: () => executor.strip(matcher, matchContext),
  };
};

const descendAndCheck = <T extends AnyCaseNodeType>(
  matcherOrData: CaseNodeFor<T> | AnyLeafOrStructure,
  parentMatchContext: MatchContext,
  actual: unknown
): ReturnType<MatcherExecutor<AnyCaseNodeType>['check']> =>
  getExecutor(matcherOrData, parentMatchContext).check(actual);

const descendAndStrip = <T extends AnyCaseNodeType>(
  matcherOrData: CaseNodeFor<T> | AnyLeafOrStructure,
  parentMatchContext: MatchContext
): ReturnType<MatcherExecutor<T>['strip']> => {
  if (
    typeof matcherOrData === 'object' &&
    matcherOrData !== null &&
    'case:matcher:example' in matcherOrData
  ) {
    return getExecutor(
      matcherOrData['case:matcher:example'],
      parentMatchContext
    ).strip();
  }
  return getExecutor(matcherOrData, parentMatchContext).strip();
};

const selfVerify = <T extends AnyCaseNodeType>(
  matcherOrData: CaseNodeFor<T> | AnyLeafOrStructure,
  parentMatchContext: MatchContext
): ReturnType<MatcherExecutor<AnyCaseNodeType>['check']> =>
  getExecutor(matcherOrData, parentMatchContext).check(
    descendAndStrip(matcherOrData, parentMatchContext)
  );

export const traversals = {
  descendAndCheck,
  descendAndStrip,
  selfVerify,
};
