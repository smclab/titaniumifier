
require('ti-mocha');

var should = require('should');

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
  var DeepThink;
  var deepthink

  it('should work', function () {
    DeepThink = require('module-a');

    deepthink = new DeepThink();

    deepthink.answer().should.be.eql(42);

    deepthink.answer.is(deepthink.answer()).should.be.true;
  });

  it('should throw on missing native deps', function () {
    (function () {
      deepthink.magratea();
    }).should.throw();
  });

  it('should work inside module, between modules', function () {
    deepthink.identity().call(null, 42).should.eql(42);
    require('module-c').call(null, 42).should.eql(42);

    should(deepthink.identity() === require('module-c')).be.true;
  });
});

mocha.run(function (failures) {
  if (failures > 0) {
    Ti.API.info('[TESTS WITH FAILURES]');
  }
  else {
    Ti.API.info('[TESTS ALL OK]');
  }
});
