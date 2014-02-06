
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

test("Some console tests", function () {
  console.should.have.a.property('log');
  console.should.have.a.property('warn');
  console.should.have.a.property('error');
  console.should.have.a.property('trace');
  console.should.have.a.property('assert');
});

test("Some global tests", function () {
  require('./setup-global-var.js');

  (typeof globalVar).should.not.equal('undefined');
});

test("Console tests", function () {
  console.dir({ answer: 42 });
});

