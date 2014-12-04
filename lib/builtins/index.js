
var original = require('browserify/lib/builtins');

exports.vm = require.resolve('vm-titanium');
exports.os = require.resolve('titanium-os/src/titanium-os');
exports.fs = require.resolve('ti-fs/src/ti-fs');

Object.keys(original).forEach(function (key) {
  if (!(key in exports)) exports[ key ] = original[ key ];
});

exports.assert = false; // ???
