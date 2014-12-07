
module.exports = exports = DeepThink.DeepThink = DeepThink;

function DeepThink() {
  this.answer = require('module-b');
};

DeepThink.prototype.magratea = function () {
  require('i.dont.exist'); // Throws
};

DeepThink.prototype.identity = function () {
  return require('module-c');
};
