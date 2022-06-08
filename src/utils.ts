import chalk from "chalk";
import { EOL } from "os";

export type GenericObject = { [key: string]: any };

export function printError(message: string) {
  process.stderr.write(chalk.red("Error: ") + message + EOL);
  process.stderr.write(
    `Hint: Use the ${chalk.green(
      "--help"
    )} option to get help about the usage` + EOL
  );
}

export default async (message: string, error: Error): Promise<never> => {
  if (message) {
    printError(message);
    process.exit(1);
  }
  printError(error.message);
  process.exit(1);
};

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
