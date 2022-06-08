import chalk from "chalk";
import type { Arguments, CommandBuilder } from "yargs";
import { setConfig } from "../services/config";

type Options = {
  id: string;
};

export const command: string = "set <id>";
export const desc: string = "Set the Virtual Machine ID";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("id", { type: "string", demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { id } = argv;

  setConfig({ vm: id });
  console.log(chalk.green("PaperSpace VM set!"));

  process.exit(0);
};
