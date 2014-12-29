
var Promise = require('bluebird');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');

var slice = Array.prototype.slice;

function lift(from, name) {
  exports[ name ] = Promise.promisify(from[ name ], from);
}

lift(fs, 'readFile');
lift(fs, 'writeFile');
lift(fs, 'stat');
lift(fs, 'rename');
lift(fs, 'readdir');

exports.rimraf = Promise.promisify(rimraf);

exports.mkdirp = Promise.promisify(mkdirp);

exports.mv = exports.rename;

exports.isFile = Promise.promisify(function (file, cb) {
  fs.stat(file, function (err, stat) {
    if (err && err.code === 'ENOENT') cb(null, false);
    else if (err) cb(err);
    else cb(null, stat.isFile() || stat.isFIFO());
  });
});

exports.isDirectory = Promise.promisify(function (file, cb) {
  fs.stat(file, function (err, stat) {
    if (err && err.code === 'ENOENT') cb(null, false);
    else if (err) cb(err);
    else cb(null, stat.isDirectory());
  });
});
