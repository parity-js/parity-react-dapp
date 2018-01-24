const injectParityReactDapp = require('parity-react-dapp/inject');

module.exports = {
  webpack: injectParityReactDapp.webpack,
  devServer: injectParityReactDapp.devServer
};
