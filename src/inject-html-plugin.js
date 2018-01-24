const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { replacePlugin } = require('./utils');

const INDEX_PATH = path.resolve(__dirname, 'public/index.ejs');
const IS_DEV = process.env.NODE_ENV === 'development';
const NO_DAPP = !!process.env.NO_DAPP;

module.exports = function injectHTMLPlugin (config) {
  const htmlPlugin = new HtmlWebpackPlugin(
    {
      inject: true,
      template: INDEX_PATH,

      // Inject Parity by default in dev mode,
      // but user can opt-out
      injectParity: IS_DEV && !NO_DAPP
    }
  );

  config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), htmlPlugin);

  return config;
};
