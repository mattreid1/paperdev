import ora from "ora";
import chalk from "chalk";
import Paperspace from "paperspace-node";
import { getConfig } from "../services/config";
import { GenericObject, printError, sleep } from "../utils";
import { promisify } from "util";
import { spawn } from "child_process";
import { isPortReachable } from "../services/networking";

type Action = "start" | "stop" | "connect" | "wait" | "end";

export const command: string = "$0"; // Default command
export const desc: string = "Connect to the PaperSpace VM";

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
  const machineStop = promisify(ps.machines.stop);

  let action: Action = "wait";
  let machine: GenericObject = {};

  while (action !== "connect") {
    // Get the current VM information
    machine = await machineShow({
      machineId: config.vm,
    }).catch((err: Error) => {
      spinner.stop();
      // If no VM exists, exit
      if (err.message.trim() == "Not Found") {
        printError(
          `PaperSpace VM not found. Please make sure the VM ${config.vm} exists`
        );
      } else {
        printError(err.message);
      }
      process.exit(0);
    });

    // https://docs.paperspace.com/core/api-reference/machines#show
    switch (machine.state) {
      case "off":
        action = "start";
        break;
      case "starting":
        action = "wait";
        break;
      case "stopping":
        action = "end";
        break;
      case "restarting":
        action = "wait";
        break;
      case "serviceready":
        action = "wait";
        break;
      case "ready":
        action = "connect";
        break;
      case "upgrading":
        action = "end";
        break;
      case "provisioning":
        action = "end";
        break;
      default:
        spinner.stop();
        printError(`PaperSpace gave an unknown state "${machine.state}"`);
        process.exit(0);
    }

    switch (action) {
      case "connect":
        spinner.color = "green";
        spinner.text = "Connecting to VM";
        break;
      case "end":
        spinner.color = "red";
        spinner.text = "VM is stopping";
        await machineStop({ machineId: config.vm });
        console.log("VM is stopping. Please try again later.");
        process.exit(0);
        break;
      case "start":
        spinner.color = "blue";
        spinner.text = "Starting VM";
        await machineStart({ machineId: config.vm });
        break;
      case "wait":
        // Wait 2500 ms until next check
        await sleep(2500);
        break;
      default:
        spinner.stop();
        printError(`PaperDev entered an unknown state "${action}"`);
        process.exit(0);
        break;
    }
  }

  // Wait for IP address assignment
  let i = 0;
  while (i < 10 && machine.publicIpAddress == null) {
    await sleep(1000);
    machine = await machineShow({
      machineId: config.vm,
    });
    i++;
  }

  // Exit if no IP is assigned
  if (machine.publicIpAddress == null) {
    spinner.stop();
    printError("PaperSpace VM does not have a public IP address");
    process.exit(0);
  }

  // Wait for the SSH service to start (can take a while)
  let sshUp = false;
  i = 0;
  while (i < 50 && sshUp !== true) {
    sshUp = await isPortReachable(22, {
      host: machine.publicIpAddress,
      timeout: 5000,
    });
    i++;
    spinner.text = "Connecting to VM (waiting for SSH service to start)";
    await sleep(1000);
  }

  spinner.stop();

  // Create an SSH session and skip checking key if not already known
  const shell = spawn(
    "ssh",
    ["-o", "StrictHostKeyChecking=no", `paperspace@${machine.publicIpAddress}`],
    {
      cwd: process.cwd(),
      detached: true,
      stdio: "inherit",
    }
  );

  // When the session exits, stop the VM
  shell.on("close", async () => {
    spinner.color = "red";
    spinner.text = "VM is stopping";
    spinner.start();
    await machineStop({ machineId: config.vm });
    await sleep(1500);
    spinner.stop();
    console.log(chalk.blue("VM is stopping"));
    process.exit(0);
  });
};
