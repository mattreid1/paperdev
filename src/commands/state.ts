import { getConfig } from "../services/config";
import Paperspace from "paperspace-node";
import { promisify } from "util";
import chalk from "chalk";
import ora from "ora";
import { printError } from "../utils";

export const command: string = "state";
export const desc: string = "Displays the current state of the VM";

export const handler = async (): Promise<void> => {
  let spinner = ora({ text: "Checking VM state", color: "yellow" });
  spinner.start();

  const config = getConfig();
  if (config.key == null) {
    spinner.stop();
    printError(
      'PaperSpace API key not set. Please run "paperdev auth <API_KEY>"'
    );
    process.exit(0);
  }

  if (config.vm == null) {
    spinner.stop();
    printError('PaperSpace VM not set. Please run "paperdev vm set <VM_ID>"');
    process.exit(0);
  }

  const ps = Paperspace({ apiKey: config.key });
  const machineShow = promisify(ps.machines.show);

  const machine = await machineShow({
    machineId: config.vm,
  }).catch((err: Error) => {
    spinner.stop();
    if (err.message.trim() == "Not Found") {
      printError(
        `PaperSpace VM not found. Please make sure the VM ${config.vm} exists`
      );
    } else {
      printError(err.message);
    }
    process.exit(0);
  });

  spinner.stop();

  // https://docs.paperspace.com/core/api-reference/machines#show
  switch (machine.state) {
    case "off":
      console.log(`Machine: ${chalk.red("Off")}`);
      break;
    case "starting":
      console.log(`Machine: ${chalk.blue("Starting")}`);
      break;
    case "stopping":
      console.log(`Machine: ${chalk.red("Stopping")}`);
      break;
    case "restarting":
      console.log(`Machine: ${chalk.blue("Restarting")}`);
      break;
    case "serviceready":
      console.log(`Machine: ${chalk.yellow("Service Ready")}`);
      break;
    case "ready":
      console.log(`Machine: ${chalk.green("Ready")}`);
      break;
    case "upgrading":
      console.log(`Machine: ${chalk.yellow("Upgrading")}`);
      break;
    case "provisioning":
      console.log(`Machine: ${chalk.yellow("Provisioning")}`);
      break;
    default:
      spinner.stop();
      printError(`PaperSpace gave an unknown state "${machine.state}"`);
  }

  process.exit(0);
};
