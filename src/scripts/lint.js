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

const path = require('path');
const { spawn } = require('child_process');
const ora = require('ora');
const fs = require('fs-extra');

const DAPP_DIRECTORY = fs.realpathSync(process.cwd());

async function aspawn (command, args) {
  return new Promise((resolve) => {
    spawn(command, args, {
      cwd: DAPP_DIRECTORY,
      stdio: 'inherit'
    }).on('exit', (code) => {
      if (code !== 0) {
        process.exit(code);
      }

      resolve();
    });
  });
}

async function lintJS () {
  const args = process.argv.length > 3
    ? process.argv.slice(3)
    : [ '--cache', 'src' ];

  const dappEslint = path.resolve(DAPP_DIRECTORY, './node_modules/.bin/eslint');
  const selfEslint = path.resolve(__dirname, '../../node_modules/.bin/eslint');

  const eslint = fs.existsSync(dappEslint)
    ? dappEslint
    : selfEslint;

  const spinner = ora('Linting JS').start();

  await aspawn(eslint, args);
  spinner.succeed();
}

async function lintCSS () {
  const args = process.argv.length > 3
    ? process.argv.slice(3)
    : [ './src/**/*.css', '--cache' ];

  const dappStylelint = path.resolve(DAPP_DIRECTORY, './node_modules/.bin/stylelint');
  const selfStylelint = path.resolve(__dirname, '../../node_modules/.bin/stylelint');

  const stylelint = fs.existsSync(dappStylelint)
    ? dappStylelint
    : selfStylelint;

  const spinner = ora('Linting CSS').start();

  await aspawn(stylelint, args);
  spinner.succeed();
}

async function lint () {
  await lintJS();
  await lintCSS();
}

module.exports = { lint, lintJS, lintCSS };
