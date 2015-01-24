
var path = require('path');
var fs = require('fs');
var readFileSync = fs.readFileSync;

function fromPath(modulepath, extra) {
  return function () {
    return 'require(' + JSON.stringify(modulepath) + ')' + (extra ? '.' + extra : '');
  };
}

module.exports = {

  // see ../builtins/index.js
  console: fromPath('--console--'),
  process: fromPath('--process--'),
  global: fromPath('--global--'),
  clearInterval: fromPath('--timers--', 'clearInterval'),
  clearTimeout: fromPath('--timers--', 'clearTimeout'),
  setInterval: fromPath('--timers--', 'setInterval'),
  setTimeout: fromPath('--timers--', 'setTimeout'),

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
