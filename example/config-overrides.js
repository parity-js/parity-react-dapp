const rewireParity = require('react-app-rewire-parity');

module.exports = (config) => {
  config = rewireParity(config);

  return config;
};
