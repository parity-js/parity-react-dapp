const cloneDeep = require('lodash.clonedeep');
const { loaderNameMatches } = require('react-app-rewired');

const { addBeforeRule, findRule } = require('./utils');

module.exports = function injectCSSRules (config) {
  const cssRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.css$/);
  const cssLoaderMatcher = (rule) => loaderNameMatches(rule, 'css-loader');
  const fileLoaderMatcher = (rule) => loaderNameMatches(rule, 'file-loader');
  const postcssLoaderMatcher = (rule) => loaderNameMatches(rule, 'postcss-loader');

  const cssModulesRule = findRule(config.module.rules, cssRuleMatcher);
  const cssRule = cloneDeep(cssModulesRule);
  const cssLoader = findRule(cssRule, cssLoaderMatcher);
  const postcssLoader = findRule(cssRule, postcssLoaderMatcher);

  // Original rule only for Node modules
  cssModulesRule.include = /node_modules/;

  // Project CSS always use modules
  cssRule.exclude = /node_modules/;
  cssLoader.options = Object.assign({
    modules: true,
    localIdentName: '[name]_[local]_[hash:base64:10]'
  }, cssLoader.options);

  // Add postcss plugins
  const postcssPlugins = postcssLoader.options.plugins();

  postcssLoader.options.plugins = () => {
    return [].concat(
      postcssPlugins,

      require('postcss-import'),
      require('postcss-nested'),
      require('postcss-simple-vars')
    );
  };

  addBeforeRule(config.module.rules, fileLoaderMatcher, cssRule);

  return config;
};
