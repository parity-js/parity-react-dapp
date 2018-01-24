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

const spinner = require('./spinner');

const { api, getContracts } = require('./api');

// `commit` is a byte20
const AS_DAPP_COMMIT_VALUE = '0x' + ('1'.padStart(40, '0'));
const INVALID_URL_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Convert the given URL to a content hash,
 * and checks if it is already registered in GHH
 */
async function urlToHash (url) {
  const contracts = await getContracts();
  const instance = contracts.githubHint.instance;

  const contentHash = await api.parity.hashContent(url);

  if (contentHash === INVALID_URL_HASH) {
    throw new Error(`"${url}" is not a valid URL`);
  }

  const [ ,, contentHashOwner ] = await instance.entries.call({}, [contentHash]);
  const registered = (contentHashOwner !== ZERO_ADDRESS);

  return {
    hash: contentHash,
    registered,
    owner: contentHashOwner
  };
}

/**
 * Register the given URL to GithubHint
 */
async function registerUrl ({ url, owner, asDapp = false }) {
  const contracts = await getContracts();
  const instance = contracts.githubHint.instance;

  spinner.start(`Hashing ${url}`);
  const { hash, registered, owner: hashOwner } = await urlToHash(url);

  spinner.succeed(`Hashed ${url}`);

  if (registered && hashOwner.toLowerCase() !== owner.toLowerCase()) {
    throw new Error(`The URL ${url} is already registered by another user (${hashOwner}).`);
  }

  const values = asDapp
    ? [ hash, url, AS_DAPP_COMMIT_VALUE ]
    : [ hash, url ];
  const options = {
    from: owner
  };

  const gas = await instance.hintURL.estimateGas(options, values);

  options.gas = gas.mul(1.2).toFixed(0);

  spinner.start(`Registering URL ${url}`);
  const requestId = asDapp
    ? await instance.hint.postTransaction(options, values)
    : await instance.hintURL.postTransaction(options, values);

  spinner.succeed(`Registered URL ${url}`);
  return { hash, requestId };
}

async function registerDapp ({ id }) {
  const contracts = await getContracts();
  const instance = contracts.dappReg.instance;

  const values = [ id ];
  const options = {};

  const fee = await instance.fee.call({}, []);

  options.value = fee;
  const gas = await instance.register.estimateGas(options, values);

  options.gas = gas.mul(1.2).toFixed(0);
  return instance.register.postTransaction(options, values);
}

async function setMeta ({ id, key, owner, value }) {
  const contracts = await getContracts();
  const instance = contracts.dappReg.instance;

  // Check if meta data changed
  const meta = await instance.meta.call({}, [ id, key ]);

  // Metadata already set
  if (meta === value) {
    return { requestId: null };
  }

  const options = { from: owner };
  const values = [ id, key, value ];

  const gas = await instance.setMeta.estimateGas(options, values);

  options.gas = gas.mul(1.2).toFixed(0);

  spinner.start(`Sending tx for registering metadata ${key}`);
  const requestId = await instance.setMeta.postTransaction(options, values);

  spinner.succeed(`Sent tx for registering metadata ${key}`);
  return { requestId };
}

async function getDappOwner ({ id }) {
  const contracts = await getContracts();
  const instance = contracts.dappReg.instance;

  const [ , owner ] = await instance.get.call({}, [ id ]);

  return owner;
}

async function updateDapp ({ id, ...urls }) {
  const owner = await getDappOwner({ id });

  const types = {
    content: 'CONTENT',
    image: 'IMG',
    manifest: 'MANIFEST'
  };

  const requestIds = [];

  for (const key in types) {
    const metaUrl = urls[key];
    const metaKey = types[key];
    const asDapp = key === 'content';

    const { hash, requestId: ghhReqId } = await registerUrl({ url: metaUrl, owner, asDapp });
    const { requestId: dappReqId } = await setMeta({ id, key: metaKey, owner, value: hash });

    requestIds.push(ghhReqId);
    requestIds.push(dappReqId);
  }

  return requestIds.filter((req) => req);
}

module.exports = {
  getDappOwner,
  registerDapp,
  updateDapp
};
