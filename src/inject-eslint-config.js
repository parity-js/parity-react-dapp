const { createLoaderMatcher, findRule } = require('./utils');

module.exports = function injectEslintConfig (config) {
  const eslintRule = findRule(config.module.rules, createLoaderMatcher('eslint-loader'));

  if (!eslintRule) {
    console.log('Could not find Eslint rule');
    return config;
  }

  eslintRule.options.baseConfig = require('../eslint.config');

  return config;
};
