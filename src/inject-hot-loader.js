const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = function injectHotLoader (config) {
  if (IS_DEV) {
    config.entry = [].concat(
      require.resolve('react-hot-loader/patch'),
      config.entry
    );
  }

  return config;
};
