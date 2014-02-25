
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
var ENTRY = path.resolve(__dirname, 'fake-module');

sequence([
  testPack,
  testBuild.bind(null, {}),
  testBuild.bind(null, {
    noDependencies: true
  }),
  testBuild.bind(null, {
    as: 'fake-name'
  }),
  testBuild.bind(null, {
    as: 'fake-name',
    noDependencies: true
  }),
  testZips,
]).done(function () {
  console.log('');
  console.log(' ✔ '.green + "Packer tests run smootly");
});

function testPack() {
  return fs.mkdirp(BUILD_DIR)
  .then(function () {
    return packer.pack(ENTRY, {
      //
    });
  })
  .then(function (src) {
    return fs.writeFile(path.resolve(BUILD_DIR, 'packed.js'), src).yield(src);
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

    vm.runInNewContext(src, sandbox, require.resolve('./fake-module'));
  });
}

function testBuild(cfg) {
  cfg.entry = ENTRY;
  return packer.build(cfg).then(function (zip) {
    return zip.writeModule(BUILD_DIR);
  });
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
