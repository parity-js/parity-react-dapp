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

const inquirer = require('inquirer');
const fetch = require('node-fetch');
const config = require('./config');

const AUTH_URL = 'https://api.github.com/authorizations';
const GITHUB_SCOPES = [ 'repo' ];

async function isValidToken (token) {
  const req = await fetch('https://api.github.com/user/repos', {
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'parity-react-scripts authenticator',
      'Content-type': 'application/json'
    }
  });

  return req.status >= 200 && req.status < 300;
}

async function connect ({ username, password, otp = null }) {
  const options = {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      'X-GitHub-OTP': otp,
      'User-Agent': 'parity-react-scripts authenticator',
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      scopes: GITHUB_SCOPES,
      note: `Parity React Scripts (${new Date().toJSON()})`
    })
  };

  const req = await fetch(AUTH_URL, options);

  return req;
}

async function check (request) {
  const { status } = request;

  if (status >= 300 || status < 200) {
    const text = await request.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (error) {
    }

    const message = json
      ? json.message
      : text;

    console.error({ json, text, status });
    throw new Error(message || `Unkown error occured (status code ${status})`);
  }
}

async function getToken () {
  const { github } = await config.read();

  if (github && github.token) {
    const { token } = github;

    if (await isValidToken(token)) {
      return token;
    }
  }

  const { username, password } = await inquirer.prompt([
    { type: 'input', name: 'username', message: 'Enter your Github username:' },
    { type: 'password', name: 'password', message: 'Enter your Github password:' }
  ]);

  let request = await connect({ username, password });

  if (request.status === 401) {
    const otpHeader = request.headers.get('X-GitHub-OTP');

    // 2-FA required
    if (/required/.test(otpHeader)) {
      const { otp } = await inquirer.prompt([
        { type: 'input', name: 'otp', message: 'Enter your Github OTP/2FA Code:' }
      ]);

      request = await connect({ username, password, otp });
    }
  }

  if (request.status === 401) {
    throw new Error(`Invalid credentials for Github user "${username}".`);
  }

  await check(request);

  const { token } = await request.json();

  await config.write({ github: { username, token } });
  return token;
}

module.exports = { getToken };
