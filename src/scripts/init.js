// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const partition = require('lodash.partition');

const spinner = require('./spinner');

const TEMPLATE_DIRECTORY = path.resolve(__dirname, '../templates');
const DAPP_DIRECTORY = fs.realpathSync(process.cwd());

async function copyFiles () {
  const files = await fs.readdir(TEMPLATE_DIRECTORY);
  const appFiles = await fs.readdir(DAPP_DIRECTORY);

  const [ created, modifiedTmp ] = partition(files, (f) => !appFiles.includes(f));
  const modified = [];

  for (const file of modifiedTmp) {
    const sourceContent = await fs.readFile(path.resolve(TEMPLATE_DIRECTORY, file));
    const destContent = await fs.readFile(path.resolve(DAPP_DIRECTORY, file));

    if (sourceContent.toString() !== destContent.toString()) {
      modified.push(file);
    }
  }

  const toCopy = [].concat(modified, created);

  if (toCopy.length === 0) {
    return;
  }

  if (modified.length > 0) {
    console.log('The following files will be overwritten:');

    modified.forEach((file) => console.log(` ${chalk.yellow.bold('M')} ${file}`));

    const { accepted } = await inquirer.prompt([
      { type: 'confirm', name: 'accepted', message: 'Do you want to continue:' }
    ]);

    if (!accepted) {
      return;
    }
  }

  spinner.start('Copying files');

  for (const file of toCopy) {
    const filepath = path.resolve(TEMPLATE_DIRECTORY, file);

    await fs.copyFile(filepath, path.join(DAPP_DIRECTORY, file));
  }

  spinner.succeed('Copied files');
}

async function addScripts () {
  const packageFilepath = path.resolve(DAPP_DIRECTORY, 'package.json');
  const dappPackage = require(packageFilepath);

  const scripts = {
    build: 'parity-react-dapp build',
    init: 'parity-react-dapp init',
    lint: 'parity-react-dapp lint',
    'lint:css': 'parity-react-dapp lint-css',
    'lint:js': 'parity-react-dapp lint-js',
    release: 'parity-react-dapp release',
    start: 'parity-react-dapp start',
    test: 'parity-react-dapp test'
  };

  const keys = Object.keys(scripts).filter((key) => dappPackage.scripts[key] !== scripts[key]);

  if (keys.length === 0) {
    return;
  }

  console.log(`${chalk.yellow.bold('⚠')} The following scripts will be added to your package.json file:`);
  keys.forEach((key) => console.log(`  "${chalk.bold(key)}": "${scripts[key]}"`));

  const { accepted } = await inquirer.prompt([
    { type: 'confirm', name: 'accepted', message: 'Do you want to continue:' }
  ]);

  if (!accepted) {
    return;
  }

  keys.forEach((key) => {
    dappPackage.scripts[key] = scripts[key];
  });

  await fs.writeFile(packageFilepath, JSON.stringify(dappPackage, null, 2));
}

async function init () {
  await copyFiles();
  await addScripts();

  spinner.start('All done').succeed();
}

module.exports = init;
