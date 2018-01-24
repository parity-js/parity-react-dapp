const path = require('path');
const { getBabelLoader } = require('react-app-rewired');

const { createLoaderMatcher, findIndexAndRules } = require('./utils');

module.exports = function injectBabel (config) {
  const { index, rules } = findIndexAndRules(config.module.rules, createLoaderMatcher('babel-loader'));

  rules[index].include = [].concat(
    rules[index].include || [],
    path.resolve(__dirname)
  );

  const babelLoader = getBabelLoader(config.module.rules);

  babelLoader.options = Object.assign({}, babelLoader.options, {
    babelrc: false,
    presets: [ path.resolve(__dirname, './babel-preset.js') ]
  });

  return config;
};
