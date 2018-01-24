const injectParityReactDapp = require('parity-react-dapp/inject');

module.exports = (config) => {
  config = injectParityReactDapp(config);

  return config;
};
