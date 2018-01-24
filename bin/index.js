#!/usr/bin/env node
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

const chalk = require('chalk');

const spinner = require('../src/scripts/spinner');
const init = require('../src/scripts/init');
const { lint, lintJS, lintCSS } = require('../src/scripts/lint');
const release = require('../src/scripts/release');

async function main () {
  const command = process.argv[2];

  // If linting, spawn a new process and pass all the arguments
  if (command === 'lint') {
    return lint();
  }

  if (command === 'lint-js') {
    return lintJS();
  }

  if (command === 'lint-css') {
    return lintCSS();
  }

  if (command === 'init') {
    return init();
  }

  if (command === 'release') {
    return release();
  }

  // Run the main React Scripts
  require('react-app-rewired/bin/index');
}

main()
  .then(() => {
    process.exit(0);
  }).catch((error) => {
    spinner.fail();
    console.error(chalk.bold.red(error.message) + '\n');
    process.exit(1);
  });
