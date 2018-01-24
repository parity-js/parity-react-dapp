const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = function injectPlugins (config) {
  // Add Circular Dependency Plugin
  config.plugins.push(
    new CircularDependencyPlugin({
      // exclude node modules
      exclude: /node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true
    })
  );

  return config;
};
