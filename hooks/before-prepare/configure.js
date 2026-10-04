module.exports = function () {
  const script = require.resolve('../../scripts/configure.cjs');
  delete require.cache[script];
  require(script);
};
