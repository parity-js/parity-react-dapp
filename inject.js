const injectBabel = require('./src/inject-babel');
const injectCSSRules = require('./src/inject-css-rules');
const injectEJSLoader = require('./src/inject-ejs-loader');
const injectHotLoader = require('./src/inject-hot-loader');
const injectIndex = require('./src/inject-index');
const injectHTMLPlugin = require('./src/inject-html-plugin');
const injectPlugins = require('./src/inject-plugins');

const removeRequiredFiles = require('./src/remove-required-files');

module.exports = {
  webpack: (config) => {
    // Prevent browser auto-open
    process.env.BROWSER = 'none';

    // Remove index.html as required
    removeRequiredFiles((file) => /index\.html$/.test(file));

    // Inject index JS page
    config = injectIndex(config);

    // Inject React Hot Loader
    config = injectHotLoader(config);

    // Inject misc. Webpack plugins
    config = injectPlugins(config);

    // Inject custom CSS rules
    config = injectCSSRules(config);

    // Add an EJS loader
    config = injectEJSLoader(config);

    // Inject custom Babel rules
    config = injectBabel(config);

    // Change the Webpack HTML Plugin
    config = injectHTMLPlugin(config);

    return config;
  },

  devServer: (configFunction) => {
    // Set a different default port
    process.env.PORT = process.env.PORT || 3001;

    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);

      return config;
    };
  }
};
