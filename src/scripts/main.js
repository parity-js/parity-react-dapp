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

const path = require('path');
const release = require('./release');

const INJECT_ETHEREUM_PATH = path.resolve(__dirname, '../inject-ethereum.js');

async function main () {
  const command = process.argv[2];

  if (command === 'release') {
    await release();
    return true;
  }

  // Specify that this is a dapp
  process.env.DAPP = true;

  // Set a different default port
  process.env.PORT = process.env.PORT || 3001;

  // Use relative public URLs
  process.env.PUBLIC_URL = './';

  // Specifiy which script version to use (mainly for init)
  process.env.PARITY_SCRIPT_VERSION = 'parity-react-dapp';

  // Inject the inject Ethereum script on dev
  if (command === 'start') {
    process.env.INJECT_SCRIPTS = INJECT_ETHEREUM_PATH;
  }

  // Run the main Parity React App Scripts
  await require('parity-react-app/src/scripts/main')();
}

module.exports = main;
