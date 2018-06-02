const path = require('path');

/*
 * xrequire - Same as `require` (https://nodejs.org/api/modules.html#modules_require)
 * Except that it takes absolute path as arguments, unlike `require` which takes
 * relative paths to modules.
 */
global.xrequire = module => {
  if (module.startsWith('.')) {
    return require(path.resolve(module));
  }
  return require(module);
};
global.xrequire.cache = require.cache;
global.xrequire.main = require.main;
global.xrequire.resolve = (request, options = null) => {
  if (module.startsWith('.')) {
    return require.resolve(path.resolve(request), options);
  }
  return require.resolve(request, options);
};
global.xrequire.resolve.paths = request => {
  if (module.startsWith('.')) {
    return require.resolve.paths(path.resolve(request));
  }
  return require.resolve.paths(request);
};
