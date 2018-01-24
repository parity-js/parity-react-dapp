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

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    IS_PROD
      ? 'env'
      : ['env', {
        'browsers': [
          'last 2 Chrome versions',
          'last 2 Firefox versions'
        ]
      }],
    'react'
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-export-extensions'
  ].concat(
    IS_PROD
      ? [
        'transform-react-remove-prop-types'
      ]
      : [
        'babel-plugin-transform-react-jsx-self',
        'babel-plugin-transform-react-jsx-source',
        'react-hot-loader/babel'
      ]
  ),
  retainLines: true
};
