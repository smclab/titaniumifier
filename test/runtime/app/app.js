
require('ti-mocha');
require('should');

describe('Smoke tests', function () {
  it('should work', function () {
    true.should.be.true;
  });
});

var runner = mocha.run(function() {
  // print the stats from the runner after the test completes
  if (runner.stats.failures > 0) {
    Ti.API.info('[TESTS WITH FAILURES]');
  }
  else {
    Ti.API.info('[TESTS ALL OK]');
  }

  Ti.API.info('[TESTS COMPLETE]');
});
