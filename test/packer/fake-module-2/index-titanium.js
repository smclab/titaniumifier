
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

var answer = 42;

test("Testing 'os'", function () {
  require('os').arch().should.be.equal('fake42');
});

test("Smoke test", function () {
  (answer).should.be.equal(answer);
});
