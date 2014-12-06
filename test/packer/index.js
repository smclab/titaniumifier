
require('should');
require('longjohn');

var vm = require('vm');
var when = require('when');
var sequence = require('when/sequence');
var path = require('path');
var packer = require('../../packer');
var fs = require('../../lib/util/fs');

var buildDir = path.resolve(__dirname, 'build');

var Titanium = {
  Platform: {
    architecture: 'fake42'
  },
  API: {
    log: console.log.bind(console),
    info: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    trace: console.trace.bind(console)
  }
};

before(function () {
  return fs.rimraf(buildDir).then(function () {
    fs.mkdirp(buildDir);
  });
});

describe("Building", function () {

  it("should work", function () {
    return packer.build({
      entry: path.resolve(__dirname, 'module-1')
    })
    .then(function (zip) {
      return zip.writeModule(buildDir);
    });
  });

  it("should create the right zip", function () {
    assertIsFile(path.resolve(buildDir, 'module-1-commonjs-0.1.2.zip'));
  });

});

describe("Resolution", function () {
  var entry = path.resolve(__dirname, 'module-1');
  var packed = path.resolve(buildDir, 'module-1.js');

  it("should work", function () {
    return packer.pack(entry, {
      // no config
    })
    .then(function (src) {
      return fs.writeFile(packed, src);
    });
  });

  it("should have resolved correctly the shadowed main", function () {
    var _module = { exports: {} };

    return fs.readFile(packed).then(function (src) {
      vm.runInNewContext(src, {
        Titanium: Titanium,
        Ti: Titanium,
        console: console,
        describe: describe,
        it: it,
        exports: _module.exports,
        module: _module
      }, packed);

      _module.exports.should.eql(42);
    });
  });

});

function assertIsFile(file) {
  return fs.isFile(file).then(function (isFile) {
    isFile.should.be.true;
  });
}
