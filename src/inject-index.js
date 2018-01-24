const { paths } = require('react-app-rewired');
const path = require('path');

module.exports = function injectIndex (config) {
  const entryIndex = config.entry.findIndex((entry) => entry === paths.appIndexJs);

  if (entryIndex === -1) {
    console.warn('Could not find the index JS file in Webpack entries');
    return config;
  }

  // Entry should be at `<root>/src/index.js`
  // This automatically adds React Hot Loader
  config.resolve.alias['Application'] = paths.appIndexJs;
  config.entry[entryIndex] = path.resolve(__dirname, './app.index.js');

  return config;
};
