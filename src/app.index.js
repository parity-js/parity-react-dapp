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

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const Application = require('Application').default;

ReactDOM.render(
  <AppContainer>
    <Application />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  const socket = require('webpack-dev-server/client/socket');

  /** Show Webpack HMR status */
  const hide = () => {
    const id = 'parity-react-scripts--hmr-status';
    const div = document.getElementById(id);

    if (!div) {
      return;
    }

    document.body.removeChild(div);
  };

  const status = (message, { timeout, error } = {}) => {
    const id = 'parity-react-scripts--hmr-status';
    const div = document.getElementById(id) || document.createElement('div');

    div.id = id;
    div.innerText = message;
    div.style = `
      position: absolute;
      top: 0;
      padding: 7px 10px;
      background: #343d46;
      color: #eff1f5;
      font-size: 12px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      border-bottom: 1px solid white;
      border-left: 10px solid ${error ? '#ebcb8b' : '#a3be8c'};
    `;

    div.onclick = () => {
      hide();
    };

    if (timeout) {
      setTimeout(() => {
        hide();
      }, timeout);
    }

    document.body.append(div);
  };

  // Listen to Webpack
  socket('/sockjs-node', {
    invalid: () => {
      status('App updated. Recompiling...');
    },
    'still-ok': () => {
      status('App ready.', { timeout: 2000 });
    },
    ok: () => {
      status('App ready.', { timeout: 2000 });
    },
    warnings: () => {
      status('Warnings while compiling.');
    },
    errors: errors => {
      status('Errors while compiling.\n' + errors.join('\n\n'), {
        error: true
      });
    },
    close: () => {
      status(
        'Lost connection to webpack-dev-server.\n  Please restart the server to re-establish connection...',
        { error: true }
      );
    }
  });

  module.hot.accept('Application', () => {
    const NextApplication = require('Application').default;

    ReactDOM.render(
      <AppContainer>
        <NextApplication />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
