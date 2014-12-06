
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
});

describe("Global context", function () {
  it("should work as expected", function () {
    require('insert-global');

    assert.equal(typeof globalVar, 'number');
    assert.equal(typeof global.globalVar, 'number');
    assert.equal(global.globalVar, 42);
  });
});

// Exporting something

module.exports = 42;
