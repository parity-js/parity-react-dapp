const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { replacePlugin } = require('./utils');

const INDEX_PATH = path.resolve(__dirname, 'public/index.ejs');

module.exports = function injectHTMLPlugin (config) {
  const htmlPlugin = new HtmlWebpackPlugin(
    {
      inject: true,
      template: INDEX_PATH
    }
  );

  config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), htmlPlugin);

  return config;
};
