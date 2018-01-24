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

const Api = require('@parity/api');
const Contracts = require('@parity/shared/lib/contracts').default;

const spinner = require('./spinner');

const nodeUrl = 'http://localhost:8545';
const provider = new Api.Provider.Http(nodeUrl);
const api = new Api(provider);

async function setup () {
  try {
    spinner.start('Connecting to local node');
    const blockNumber = await api.eth.blockNumber();

    spinner.succeed(`Connected to local node (block ${blockNumber.toFormat()})`);

    spinner.start('Testing the node capabilities');

    await api.parity.hashContent('http://github.com/paritytech');
    spinner.succeed('Local node has required capabilities');
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || /Method not found/i.test(error.message)) {
      throw new Error(`You must have a local Parity node running at ${nodeUrl} with "--jsonrpc-apis=all" flag`);
    }
  }
}

async function getAccounts () {
  const accounts = await api.eth.accounts();

  return accounts;
}

async function getContracts () {
  const contracts = Contracts.get(api);

  const dappReg = await contracts.dappReg.getContract();
  const githubHint = await contracts.githubHint.getContract();

  return { dappReg, githubHint };
}

async function sleep (duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

async function waitForSigner (requestId) {
  // In case of an unlocked account, the request id
  // is actually the transaction hash
  if (requestId.length === 66) {
    return requestId;
  }

  const txHash = await api.parity.checkRequest(requestId);

  if (txHash) {
    return txHash;
  }

  await sleep(1000);

  return waitForSigner(requestId);
}

async function waitForMined (txHash) {
  const txReceipt = await api.eth.getTransactionReceipt(txHash);

  if (txReceipt && txReceipt.blockHash) {
    return txReceipt;
  }

  await sleep(1000);

  return waitForMined(txHash);
}

async function follow (requestIds) {
  const txHashes = [];
  let remaining = requestIds.length;

  spinner.start(`Waiting for ${remaining} transactions to be signed`);

  await Promise.all(requestIds.map(async (requestId) => {
    const txHash = await waitForSigner(requestId);

    remaining--;
    txHashes.push(txHash);
    spinner.update(`Waiting for ${remaining} transactions to be signed`);
  }));

  spinner.succeed(`All transactions signed`);

  remaining = txHashes.length;
  spinner.start(`Waiting for ${remaining} transactions to be mined`);

  await Promise.all(txHashes.map(async (txHash) => {
    await waitForMined(txHash);

    remaining--;
    spinner.update(`Waiting for ${remaining} transactions to be mined`);
  }));

  spinner.succeed(`All transactions mined`);
}

module.exports = {
  api,
  follow,
  getAccounts,
  getContracts,
  setup
};
