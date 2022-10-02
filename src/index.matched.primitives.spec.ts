import type { AnyCaseNodeOrData } from 'core/nodes/matchers/types';
import {
  anyBoolean,
  anyNull,
  anyNumber,
  anyString,
  exactlyLike,
  shapedLike,
} from 'dsl/Matchers';
import { checkMatch } from 'core';

const expectErrorContaining = (
  matcher: AnyCaseNodeOrData,
  example: unknown,
  expectedContent: string
) => {
  describe(`when given ${example}`, () => {
    it(`returns an error containing '${expectedContent}'`, async () => {
      const matchResult = await checkMatch(matcher, example);
      expect(matchResult).not.toHaveLength(0);
      expect(
        matchResult.map((m) => m.toString()).reduce((acc, m) => `${acc} ${m}`)
      ).toContain(expectedContent);
    });
  });
};
describe('basic matchers', () => {
  describe('number matcher', () => {
    const matcher = anyNumber(1);
    it('accepts numbers', async () => {
      expect(await checkMatch(matcher, 1)).toStrictEqual([]);
    });
    expectErrorContaining(matcher, NaN, 'NaN');
    expectErrorContaining(matcher, Infinity, 'finite');
    expectErrorContaining(matcher, '1', 'not a number');
    expectErrorContaining(matcher, [], 'not a number');
    expectErrorContaining(matcher, {}, 'not a number');
  });

  describe('string matcher', () => {
    const matcher = anyString('1');
    it('accepts strings that are numbers', async () => {
      expect(await checkMatch(matcher, '1')).toStrictEqual([]);
    });
    it('accepts strings that are not numbers', async () => {
      expect(await checkMatch(matcher, 'example string')).toStrictEqual([]);
    });
    expectErrorContaining(matcher, NaN, 'not a string');
    expectErrorContaining(matcher, Infinity, 'not a string');
    expectErrorContaining(matcher, 1, 'not a string');
    expectErrorContaining(matcher, [], 'not a string');
    expectErrorContaining(matcher, {}, 'not a string');
  });

  describe('boolean matcher', () => {
    const matcher = anyBoolean(true);
    it('accepts true', async () => {
      expect(await checkMatch(matcher, true)).toStrictEqual([]);
    });
    it('accepts false', async () => {
      expect(await checkMatch(matcher, false)).toStrictEqual([]);
    });

    expectErrorContaining(matcher, 'true', 'not a boolean');
    expectErrorContaining(matcher, 'some string', 'not a boolean');
    expectErrorContaining(matcher, NaN, 'not a boolean');
    expectErrorContaining(matcher, Infinity, 'not a boolean');
    expectErrorContaining(matcher, 1, 'not a boolean');
    expectErrorContaining(matcher, [], 'not a boolean');
    expectErrorContaining(matcher, {}, 'not a boolean');
  });

  describe('null matcher', () => {
    const matcher = anyNull();
    it('accepts exactly null', async () => {
      expect(await checkMatch(matcher, null)).toStrictEqual([]);
    });

    expectErrorContaining(matcher, true, 'not null');
    expectErrorContaining(matcher, false, 'not null');
    expectErrorContaining(matcher, '1', 'not null');
    expectErrorContaining(matcher, 'some other string', 'not null');
    expectErrorContaining(matcher, NaN, 'not null');
    expectErrorContaining(matcher, Infinity, 'not null');
    expectErrorContaining(matcher, 1, 'not null');
    expectErrorContaining(matcher, [], 'not null');
    expectErrorContaining(matcher, {}, 'not null');
  });

  describe('shapedLike matchers', () => {
    describe('number matcher', () => {
      const matcher = shapedLike(1);
      it('accepts numbers', async () => {
        expect(await checkMatch(matcher, 1)).toStrictEqual([]);
      });
      expectErrorContaining(matcher, NaN, 'NaN');
      expectErrorContaining(matcher, Infinity, 'finite');
      expectErrorContaining(matcher, '1', 'not a number');
      expectErrorContaining(matcher, [], 'not a number');
      expectErrorContaining(matcher, {}, 'not a number');
    });

    describe('string matcher', () => {
      const matcher = shapedLike('1');
      it('accepts strings that are numbers', async () => {
        expect(await checkMatch(matcher, '1')).toStrictEqual([]);
      });
      it('accepts strings that are not numbers', async () => {
        expect(await checkMatch(matcher, 'example string')).toStrictEqual([]);
      });
      expectErrorContaining(matcher, NaN, 'not a string');
      expectErrorContaining(matcher, Infinity, 'not a string');
      expectErrorContaining(matcher, 1, 'not a string');
      expectErrorContaining(matcher, [], 'not a string');
      expectErrorContaining(matcher, {}, 'not a string');
    });

    describe('boolean matcher', () => {
      const matcher = shapedLike(true);
      it('accepts true', async () => {
        expect(await checkMatch(matcher, true)).toStrictEqual([]);
      });
      it('accepts false', async () => {
        expect(await checkMatch(matcher, false)).toStrictEqual([]);
      });

      expectErrorContaining(matcher, 'true', 'not a boolean');
      expectErrorContaining(matcher, 'some string', 'not a boolean');
      expectErrorContaining(matcher, NaN, 'not a boolean');
      expectErrorContaining(matcher, Infinity, 'not a boolean');
      expectErrorContaining(matcher, 1, 'not a boolean');
      expectErrorContaining(matcher, [], 'not a boolean');
      expectErrorContaining(matcher, {}, 'not a boolean');
    });

    describe('null matcher', () => {
      const matcher = shapedLike(null);
      it('accepts exactly null', async () => {
        expect(await checkMatch(matcher, null)).toStrictEqual([]);
      });

      expectErrorContaining(matcher, true, 'not null');
      expectErrorContaining(matcher, false, 'not null');
      expectErrorContaining(matcher, '1', 'not null');
      expectErrorContaining(matcher, 'some other string', 'not null');
      expectErrorContaining(matcher, NaN, 'not null');
      expectErrorContaining(matcher, Infinity, 'not null');
      expectErrorContaining(matcher, 1, 'not null');
      expectErrorContaining(matcher, [], 'not null');
      expectErrorContaining(matcher, {}, 'not null');
    });
  });

  describe('array matchers', () => {
    const matcher = shapedLike([
      1,
      'string',
      null,
      true,
      {},
      [],
      { a: '1' },
      [1],
    ]);
    it('accepts an array of generally matched types', async () => {
      expect(
        await checkMatch(matcher, [
          2,
          'other string',
          null,
          false,
          { a: 'example' },
          [],
          { a: '2' },
          [3],
        ])
      ).toStrictEqual([]);
    });
    describe('with array of generally matched types that has a different property in one of the objects', () => {
      expectErrorContaining(
        matcher,
        [2, 'other string', null, false, { a: 'example' }, [], { b: '2' }, [3]],
        "missing key 'a'"
      );
    });
    describe('with array of generally matched types that been made explicit again', () => {
      expectErrorContaining(
        shapedLike([
          1,
          'string',
          null,
          true,
          {},
          [],
          exactlyLike({ a: '1' }),
          [1],
        ]),
        [2, 'other string', null, false, { a: 'example' }, [], { a: '2' }, [3]],
        'not exactly equal'
      );
    });
  });

  describe('object matchers', () => {
    it('accepts an object of explicitly matched types', async () => {
      expect(
        await checkMatch(
          {
            a: anyNumber(2),
            b: anyString('string'),
            c: anyNull(),
            d: anyBoolean(false),
          },
          { a: 1, b: 'other string', c: null, d: true }
        )
      ).toStrictEqual([]);
    });
  });

  it('accepts an object of generally matched types', async () => {
    expect(
      await checkMatch(
        shapedLike({
          a: 2,
          b: 'string',
          c: null,
          d: false,
        }),
        { a: 1, b: 'other string', c: null, d: true }
      )
    ).toStrictEqual([]);
  });

  describe('with an object of generally matched types that has been made exact', () => {
    const matcher = shapedLike({
      a: exactlyLike(2),
      b: exactlyLike('string'),
      c: null,
      d: exactlyLike(false),
    });
    const actual = { a: 1, b: 'other string', c: null, d: true };
    expectErrorContaining(
      matcher,
      actual,
      "'1' (number) is not exactly equal to '2' (number)"
    );
    expectErrorContaining(
      matcher,
      actual,
      "'other string' (string) is not exactly equal to 'string' (string)"
    );
    expectErrorContaining(
      matcher,
      actual,
      "'true' (boolean) is not exactly equal to 'false' (boolean)"
    );
  });
});
