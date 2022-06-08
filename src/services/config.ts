import { homedir } from "os";
import path from "path";
import fs from "fs";
import _ from "lodash";

const configPath = path.join(homedir(), ".paperdev.json");

interface ConfigFile {
  key: string | null;
  vm: string | null;
}

function createConfigFile() {
  if (fs.existsSync(configPath)) return;
  const defaultData: ConfigFile = { key: null, vm: null };
  fs.writeFileSync(configPath, JSON.stringify(defaultData));
}

export function getConfig(): ConfigFile {
  if (!fs.existsSync(configPath)) createConfigFile();
  const configData = JSON.parse(fs.readFileSync(configPath).toString());
  return configData;
}

export function setConfig(newConfig: Partial<ConfigFile>) {
  const config = _.merge(getConfig(), newConfig);
  fs.writeFileSync(configPath, JSON.stringify(config));
}
