const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { replacePlugin } = require('./utils');

const INDEX_PATH = path.resolve(__dirname, 'public/index.ejs');
const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = function injectHTMLPlugin (config) {
  const htmlPlugin = new HtmlWebpackPlugin(
    {
      inject: true,
      template: INDEX_PATH,
      injectParity: IS_DEV
    }
  );

  config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), htmlPlugin);

  return config;
};
