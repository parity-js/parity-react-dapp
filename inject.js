const injectBabel = require('./src/inject-babel');
const injectCSSRules = require('./src/inject-css-rules');
const injectEJSLoader = require('./src/inject-ejs-loader');
const injectEslintConfig = require('./src/inject-eslint-config');
const injectHotLoader = require('./src/inject-hot-loader');
const injectIndex = require('./src/inject-index');
const injectHTMLPlugin = require('./src/inject-html-plugin');
const injectParity = require('./src/inject-parity');
const injectPlugins = require('./src/inject-plugins');

const removeRequiredFiles = require('./src/remove-required-files');

module.exports = function inject (config) {
  // Prevent browser auto-open
  process.env.BROWSER = 'none';

  // Set a different default port
  process.env.PORT = process.env.PORT || 3001;

  // Use relative public URLs
  process.env.PUBLIC_URL = './';

  // Remove index.html as required
  removeRequiredFiles((file) => /index\.html$/.test(file));

  // Inject index JS page
  config = injectIndex(config);

  // Inject React Hot Loader
  config = injectHotLoader(config);

  // Inject misc. Webpack plugins
  config = injectPlugins(config);

  // Inject Parity injection script
  config = injectParity(config);

  // Inject Eslint custom config
  config = injectEslintConfig(config);

  // Inject custom CSS rules
  config = injectCSSRules(config);

  // Add an EJS loader
  config = injectEJSLoader(config);

  // Inject custom Babel rules
  config = injectBabel(config);

  // Change the Webpack HTML Plugin
  config = injectHTMLPlugin(config);

  return config;
};
