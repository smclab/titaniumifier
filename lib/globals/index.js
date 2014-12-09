
var path = require('path');
var fs = require('fs');
var readFileSync = fs.readFileSync;

var consoleModulePath = require.resolve('ti-console/src/ti-console');

var processModulePath = require.resolve('./process');

var globalModulePath = require.resolve('./global');

function fromPath(modulepath, extra) {
  return function () {
    return 'require(' + JSON.stringify(modulepath) + ')' + (extra ? '.' + extra : '');
  };
}

module.exports = {

  console: fromPath(consoleModulePath),

  process: fromPath(processModulePath),

  global: fromPath(globalModulePath),

  Buffer: fromPath('buffer', 'Buffer'),

  __filename: function (filepath, basedir) {
    var file = '/' + path.relative(basedir, filepath);
    return JSON.stringify(file);
  },

  __dirname: function (filepath, basedir) {
    var dir = path.dirname('/' + path.relative(basedir, filepath));
    return JSON.stringify(dir);
  }

};
