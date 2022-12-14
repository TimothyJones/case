import chalk from 'chalk';
import { locationString as formatLocationString } from 'entities/context';
import type { HasLocation } from 'entities/context/types';
import { nameExample } from 'entities/contract/interactions';
import type { CaseExample } from 'entities/contract/types';
import { actualToString } from 'entities/results/renderActual';
import type { MatchingError, ResultPrinter } from 'entities/types';
import { Console } from 'node:console';

const stdout = new Console({ stdout: process.stdout });

const locationString = (context: HasLocation) =>
  `${formatLocationString(context)}`;

const spaces = (size: number, str: string) => {
  const space = new Array(size).fill(' ').join('');
  return `${space}${str.replace(/\n/g, `\n${space}`)}`;
};

const firstLine = (error: MatchingError) =>
  spaces(
    6,
    `${chalk.bgRed.white(' MATCHING ERROR ')}: ${chalk.whiteBright(
      error.message
    )}`
  );

const secondLine = (error: MatchingError) =>
  spaces(
    9,
    `Expected something like:\n${spaces(
      3,
      chalk.green(actualToString(error.expected, 10))
    )}`
  );

const thirdLine = (error: MatchingError) =>
  spaces(
    9,
    `Actual:\n${spaces(3, chalk.red(actualToString(error.actual, 10)))}`
  );

const finalLine = (error: MatchingError) =>
  spaces(
    12,
    `${chalk.gray(
      ` - ${locationString({
        'case:currentRun:context:location': error.location,
      })} [${error.matcher['case:matcher:type']}]`
    )}`
  );

const printError = (error: MatchingError): void => {
  // This is done as one line to prevent it splitting when multiple tests are running
  stdout.log(
    `${firstLine(error)}\n${secondLine(error)}\n${thirdLine(
      error
    )}\n\n${finalLine(error)}\n\n`
  );
};

const printFailureTitle = (example: CaseExample, index: string): void => {
  // This is done as one line to prevent it splitting when multiple tests are running
  stdout.log(
    spaces(
      3,
      `\n${chalk.red(`✘`)} ${chalk.whiteBright(
        nameExample(example, index)
      )}\n   Error details follow:\n`
    )
  );
};

const printSuccessTitle = (example: CaseExample, index: string): void => {
  // This is done as one line to prevent it splitting when multiple tests are running
  stdout.log(
    spaces(
      3,
      `\n${chalk.greenBright(`✅`)} ${chalk.whiteBright(
        nameExample(example, index)
      )}\n`
    )
  );
};

export const resultPrinter: ResultPrinter = {
  printError,
  printFailureTitle,
  printSuccessTitle,
};
