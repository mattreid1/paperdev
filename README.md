# paperdev - Save money when running VMs in PaperSpace

[![](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm](https://img.shields.io/npm/v/paperdev.svg)](https://www.npmjs.com/package/paperdev)
[![npm](https://img.shields.io/npm/l/paperdev.svg)](https://spdx.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dt/paperdev.svg)](<[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/paperdev)>)

`paperdev` is an unofficial CLI tool that automatically starts and stops PaperSpace VMs. Only be billed for the exact amount of time you need.

Simply run `paperdev` to start your VM and drop you directly into SSH. When you `exit` your VM, `paperdev` will automatically stop your VM, preventing you from being billed for unused compute time. (You will still be billed for storage space, etc.)

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [Demo](#demo)
- [Contribute](#contribute)
- [License](#license)

## Background

A VM with 8 vCPUs and 16 GiB RAM costs US$95 per month - expensive for adhoc work. You can also run the VM for US$0.13 per hour but then you have to manually start and stop the VM in a web interface and you still get billed if you forget to turn it off.

If you run the VM for 30 hours a week, every week, for a month, at the end of the month you would be billed only US$16.77, saving you $78.23 (or more than 80%) for the above configuration. `paperdev` allows you to run VMs for only the hours you need with a single command.

This tools allows you to quickly spin up and spin down high powered machines (even with GPUs) for a fraction of the monthly cost.

## Install

This package is distributed via NPM. To install it, you can run `npm i -g paperdev`

## Usage

Before using `paperdev`, you must first enter your [API Key](https://docs.paperspace.com/core/api-reference/#how-to-generate-an-api-key) to enable the `paperdev` CLI tool to communicate with PaperSpace.

```
paperdev auth <API Key>
# Example: paperdev auth 4da89ce88462cbf1c6cd8b49fc2476
```

You must also create the VM in the [PaperSpace Core console](https://console.paperspace.com/). Make sure you set the **Public IP** option to **Dynamic** (preferred for cost optimization) or **Static** (for the IP address to not change). This is so you can connect to the VM over SSH. Once the VM is created, you must set the VM ID in `paperdev`.

```
paperdev set <VM ID>
# Example: paperdev set pkpzwrwzn
```

Once configured, simply run `paperdev` to start your VM and drop you directly into SSH. When you `exit` your VM, `paperdev` will automatically stop your VM, preventing you from being billed for the unused compute time.

Run `paperdev <command> --help` for help using any command.

```
Commands:
  paperdev auth      Set the API key for authentication
  paperdev           Connect to the PaperSpace VM                      [default]
  paperdev set <id>  Set the Virtual Machine ID
  paperdev start     Send the start command to the VM
  paperdev state     Displays the current state of the VM
  paperdev stop      Send the shut down command to the VM

Options:
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

### Demo

![paperdev](https://raw.githubusercontent.com/mattreid1/paperdev/main/paperdev.gif)

## Contribute

PRs are welcome!

If updating the README, please stick to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © [Matt Reid](https://mattreid.dev)

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/matt_reid1.svg?style=social&label=Follow%20%40matt_reid1)](https://twitter.com/matt_reid1)

_Get US$10 free credit with PaperSpace using [this referral link](https://console.paperspace.com/signup?R=X401JCX) ([more details](https://docs.paperspace.com/account-management/account/referrals/))._
