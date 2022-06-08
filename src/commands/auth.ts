import { setConfig } from "../services/config";
import inquirer from "inquirer";
import chalk from "chalk";

export const command: string = "auth";
export const desc: string = "Set the API key for authentication";

export const handler = async (): Promise<void> => {
  const answers = await inquirer.prompt([
    {
      type: "password",
      message: "Enter you PaperSpace API key",
      name: "key",
    },
  ]);

  setConfig({ key: answers.key });
  console.log(chalk.green("API key set!"));

  process.exit(0);
};
