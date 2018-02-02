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

import PostMessageProvider from '@parity/api/lib/provider/postMessage';
import qs from 'query-string';

function initProvider () {
  window.isParity = true;

  if (window.ethereum) {
    return window.ethereum;
  }

  if (window.web3 && window.web3.currentProvider) {
    return window.web3.currentProvider;
  }

  try {
    if (window.parent && window.parent.ethereum) {
      return window.parent.ethereum;
    }
  } catch (error) {
    console.error(error.message);
  }

  const path = window.location.pathname.split('/');
  const query = qs.parse(window.location.search);

  let appId = path[1] || query.appId;

  if (appId === 'dapps') {
    appId = path[2];
  }

  // Check if in an IFrame
  if (window.top !== window) {
    return console.error('This Dapp is not running in an IFrame. PostMessage provider will not work.');
  }

  const ethereum = new PostMessageProvider(appId);

  console.log(`Requesting API communications token for ${appId}`);

  ethereum
    .requestNewToken()
    .then((tokenId) => {
      console.log(`Received API communications token ${tokenId}`);
    })
    .catch((error) => {
      console.error('Unable to retrieve communications token', error);
    });

  return ethereum;
}

if (typeof window !== 'undefined' && !window.isParity) {
  const ethereumProvider = initProvider();

  window.ethereum = ethereumProvider;
}
