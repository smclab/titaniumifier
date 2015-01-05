
var original = require('browserify/lib/builtins');

// Shims
exports.vm = require.resolve('vm-titanium');
exports.os = require.resolve('titanium-os/src/titanium-os');
exports.fs = require.resolve('ti-fs/src/ti-fs');

// Titaniumifier built-ins
exports[ '--console--' ] = require.resolve('ti-console/src/ti-console');

// Titaniumifier internals
exports[ '--global--' ] = require.resolve('../globals/global');
exports[ '--process--' ] = require.resolve('../globals/process');

Object.keys(original).forEach(function (key) {
  if (!(key in exports)) exports[ key ] = original[ key ];
});
