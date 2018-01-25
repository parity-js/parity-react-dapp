const path = require('path');

const IS_DEV = process.env.NODE_ENV === 'development';
const NO_DAPP = !!process.env.NO_DAPP;

module.exports = function injectParity (config) {
  if (IS_DEV && !NO_DAPP) {
    config.entry = [].concat(
      path.resolve(__dirname, './public/inject'),
      config.entry
    );
  }

  return config;
};
