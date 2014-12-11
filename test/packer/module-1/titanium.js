
var assert = require('assert');

// We’re using the hosted Mocha here.

describe("Shadowing", function (){
  it("should work on `main`", function () {
    // The fact itself we’re here means it’s working
  });
});

describe("Requiring", function () {
  it("should work with `node_modules` deps" , function () {
    assert.equal(require('example'), 'example');
  });

  it("should work with json too", function () {
    assert.equal(require('./package').name, "ti-module-1");
  });

  it("should work outside the module too", function () {
    assert.equal(require('../../../package').name, 'titaniumifier');
  });

  it("should throw on missing (native) dependencies", function () {
    try {
      // directly specified by the package.json
      require('a.native.dep');
    }
    catch (e1) {
      assert.equal(e1.code, 'MODULE_NOT_FOUND');
      return;

      /*try {
        // TODO specified by a require module
        require('another.native.dep');
      }
      catch (e2) {
        assert.equal(e2.code, 'MODULE_NOT_FOUND');
        return;
      }*/
    }

    throw new Error("Shouldn’t have reached this point");
  });

});

describe("Global context", function () {
  it("should work as expected", function () {
    require('insert-global');

    assert.equal(typeof globalVar, 'number');
    assert.equal(typeof global.globalVar, 'number');
    assert.equal(global.globalVar, 42);
  });
});

describe("Globals", function () {
  it('process', function () {
    assert.equal(typeof process, 'object');
  });

  it('__dirname', function () {
    assert.equal(typeof __dirname, 'string');
  });

  it('__filename', function () {
    assert.equal(typeof __filename, 'string');
  });
});

// Exporting something

module.exports = 42;
