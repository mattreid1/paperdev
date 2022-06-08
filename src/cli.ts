#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import handleError from "./utils";

yargs(hideBin(process.argv))
  .commandDir("commands")
  .strict()
  .alias({ v: "version" })
  .alias({ h: "help" })
  .fail(handleError).argv;
