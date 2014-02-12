
require('should');

function test(msg, fn) {
  try {
    fn.call(this);
    console.log("[OK] " + msg);
  }
  catch (e) {
    console.error("[NOT-OK] " + msg);
    throw e;
  }
}

test("Renamed module", function () {
  require('reduce')([ 1, 2, 3 ], function (a, b) {
    return a + b;
  }, 0).should.be.equal(6);
});

test("Some console tests", function () {
  console.should.have.a.property('log');
  console.should.have.a.property('warn');
  console.should.have.a.property('error');
  console.should.have.a.property('trace');
  console.should.have.a.property('assert');
});

test("Some global tests", function () {
  require('./setup-global-var.js');

  (typeof globalVar).should.not.be.equal('undefined');
});

test("Console tests", function () {
  console.dir({ answer: 42 });
});

