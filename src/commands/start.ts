import { getConfig } from "../services/config";
import Paperspace from "paperspace-node";
import { promisify } from "util";
import chalk from "chalk";
import ora from "ora";
import { printError } from "../utils";

export const command: string = "start";
export const desc: string = "Send the start command to the VM";

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
  const machineStart = promisify(ps.machines.start);

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

  if (machine.state == "off") {
    await machineStart({ machineId: config.vm });
    console.log(chalk.blue("VM is starting"));
  } else {
    console.log(chalk.yellow("VM is not off"));
  }

  process.exit(0);
};
