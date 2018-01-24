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

const merge = require('lodash.merge');
const config = require('application-config')('parity-react-scripts');

async function read () {
  return new Promise((resolve, reject) => {
    config.read((error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
}

async function write (data) {
  const prev = await read();

  return new Promise((resolve, reject) => {
    config.write(merge(prev, data), (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

module.exports = { read, write };
