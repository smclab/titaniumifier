
require('should');
require('colors');

var vm = require('vm');
var when = require('when');
var sequence = require('when/sequence');
var path = require('path');
var packer = require('../../packer');
var fs = require('../../lib/util/fs');

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

var BUILD_DIR = path.resolve(__dirname, 'build');
var ENTRY_1 = path.resolve(__dirname, 'fake-module-1');
var ENTRY_2 = path.resolve(__dirname, 'fake-module-2');

before(function () {
  return fs.rimraf(BUILD_DIR);
});

describe('Packer 1', function () {
  this.timeout(10e3);

  it('Simple packing 1', function () {
    return testPack(ENTRY_1, 'packed.1.js');
  });

  it('Simple building 1', function () {
    return testBuild(ENTRY_1, {
      //
    });
  });

  it('Simple building no dependencies 1', function () {
    return testBuild(ENTRY_1, {
      noDependencies: true
    });
  });

  it('Zips', function () {

    if (files.indexOf("fake-module-1-commonjs-1.2.3-bare.zip") < 0) {
      throw new Error("No bare zip built");
    }

    if (files.indexOf("fake-module-1-commonjs-1.2.3.zip") < 0) {
      throw new Error("No simple zip built");
    }
  });
});

describe('Packer 2', function () {
  this.timeout(10e3);

  it('Simple packing 2', function () {
    return testPack(ENTRY_2, 'packed.2.js');
  });

  it('Simple building 2', function () {
    return testBuild(ENTRY_2, {
      //
    });
  });

  it('Simple building no dependencies 2', function () {
    return testBuild(ENTRY_1, {
      noDependencies: true
    });
  });

  it('Bare zip', function () {
    return fs.isFile(path.resolve(BUILD_DIR, "fake-name-commonjs-1.2.3-bare.zip"))
    .then(function (isFile) {
      isFile.should.be.true;
    });
  });

  it('Normal zip', function () {
    return fs.isFile(path.resolve(BUILD_DIR, "fake-name-commonjs-1.2.3.zip"))
    .then(function (isFile) {
      isFile.should.be.true;
    });
  });
});

function testPack(entry, expected) {
  expected = path.resolve(BUILD_DIR, expected);

  return fs.mkdirp(BUILD_DIR)
  .then(function () {
    return packer.pack(entry, {
      //
    });
  })
  .then(function (src) {
    return fs.writeFile(expected, src).yield(src);
  })
  .then(function (src) {
    var sandbox = {
      Titanium: Titanium,
      Ti: Titanium,
      module: {
        exports: {}
      }
    };

    sandbox.exports = sandbox.module.exports;

    vm.runInNewContext(src, sandbox, expected);
  });
}

function testBuild(entry, cfg) {
  cfg.entry = entry;

  return packer.build(cfg).then(function (zip) {
    return zip.writeModule(BUILD_DIR);
  });
}
