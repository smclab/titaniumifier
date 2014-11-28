
require('colors');

var vm = require('vm');
var when = require('when');
var sequence = require('when/sequence');
var path = require('path');
var packer = require('../../packer');
var fs = require('../../lib/util/fs');

var Titanium = {
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

sequence([

  clean,

  testPack(ENTRY_1, 'packed.1.js'),

  testBuild(ENTRY_1, {
    //
  }),

  testBuild(ENTRY_1, {
    noDependencies: true
  }),

  testPack(ENTRY_2, 'packed.2.js'),

  testBuild(ENTRY_2, {
    //
  }),

  testBuild(ENTRY_2, {
    noDependencies: true
  }),

  testZips

]).done(function () {
  console.log('');
  console.log(' ✔ '.green + "Packer tests run smootly");
});

function clean() {
  return fs.rimraf(BUILD_DIR);
}

function testPack(entry, expected) {
  expected = path.resolve(BUILD_DIR, expected);
  return function () {
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
  };
}

function testBuild(entry, cfg) {
  return function () {
    cfg.entry = entry;
    return packer.build(cfg).then(function (zip) {
      return zip.writeModule(BUILD_DIR);
    });
  };
}

function testZips() {
  return fs.readdir(BUILD_DIR).then(function (files) {
    if (files.indexOf("fake-module-commonjs-1.2.3-bare.zip") < 0) {
      throw new Error("No bare zip built");
    }
    if (files.indexOf("fake-module-commonjs-1.2.3.zip") < 0) {
      throw new Error("No simple zip built");
    }
    if (files.indexOf("fake-name-commonjs-1.2.3-bare.zip") < 0) {
      throw new Error("No bare zip (with fake name) built");
    }
    if (files.indexOf("fake-name-commonjs-1.2.3.zip") < 0) {
      throw new Error("No simple zip (with fake name) built");
    }

    console.log(' ✔ '.green + "All (4) zips built correctly");
  });
}
