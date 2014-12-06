
require('ti-mocha');
require('should');

describe('Smoke tests', function () {
  it('should work', function () {
    true.should.be.true;
  });
});

describe('Require', function () {
  it('should work', function () {
    require('module-a');
  });
});

describe('Module calling', function () {
  it('should work', function () {
    var DeepThink = require('module-a');

    Ti.API.error(DeepThink);

    var deepthink = new DeepThink();

    deepthink.answer.is(deepthink.answer()).should.be.true;
  });
});

mocha.run(function (failures) {
  if (failures > 0) {
    Ti.API.info('[TESTS WITH FAILURES]');
  }
  else {
    Ti.API.info('[TESTS ALL OK]');
  }

  Ti.API.info('[TESTS COMPLETE]');
});
