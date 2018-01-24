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

const path = require('path');

process.env.NODE_PATH = path.resolve(__dirname, './node_modules');
require('module').Module._initPaths();

const restrictedGlobals = require('eslint-restricted-globals');

module.exports = {
  'extends': [
    require.resolve('eslint-config-semistandard'),
    require.resolve('eslint-config-standard-react')
  ],
  'parser': require.resolve('babel-eslint'),
  'env': {
    'browser': true,
    'mocha': true,
    'node': true
  },
  'globals': {
    'expect': true,
    'FileReader': true
  },
  'rules': {
    'curly': ['error', 'all'],
    'newline-after-var': ['error', 'always'],
    'no-unused-vars': ['error', { 'args': 'after-used', 'ignoreRestSiblings': true }],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 0,
    'one-var-declaration-per-line': ['error', 'always'],
    'padded-blocks': ['error', {
      'blocks': 'never',
      'classes': 'never',
      'switches': 'never'
    }],
    'no-alert': 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': ['error', {
      'includeExports': true
    }],
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-curly-spacing': ['error', 'always']
  },
  overrides: [
    {
      files: [ '*.spec.js' ],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
};
