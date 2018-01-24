const { paths } = require('react-app-rewired');

module.exports = function removeRequiredFiles (filter) {
  [
    require.resolve('react-dev-utils/checkRequiredFiles'),
    require.resolve('react-dev-utils/checkRequiredFiles', { paths: [ paths.appNodeModules ] })
  ].forEach((checkRequireFilesPath) => {
    if (checkRequireFilesPath) {
      const oldCheckRequireFiles = require(checkRequireFilesPath);

      require.cache[checkRequireFilesPath].exports = (files) => {
        const filteredFiles = files.filter((file) => !filter(file));

        return oldCheckRequireFiles(filteredFiles);
      };
    }
  });
};
