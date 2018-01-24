const { loaderNameMatches } = require('react-app-rewired');

const { addBeforeRule } = require('./utils');

module.exports = function injectEJSLoader (config) {
  const fileLoaderMatcher = (rule) => loaderNameMatches(rule, 'file-loader');

  // Add an EJS loader
  addBeforeRule(config.module.rules, fileLoaderMatcher, {
    test: /\.ejs$/,
    use: [require.resolve('ejs-loader')]
  });

  return config;
};
