
var util = require('util');

module.exports = new Console;

function Console() {}

Console.prototype.log = function() {
	return Ti.API.info(util.format.apply(util, arguments));
};

Console.prototype.info = function() {
	return Ti.API.info(util.format.apply(util, arguments));
};

Console.prototype.trace = function() {
	return Ti.API.trace(util.format.apply(util, arguments));
};

Console.prototype.warn = function() {
	return Ti.API.warn(util.format.apply(util, arguments));
};

Console.prototype.error = function() {
	return Ti.API.error(util.format.apply(util, arguments));
};

Console.prototype.dir = function(obj) {
  return console.log(util.inspect(obj));
};

Console.prototype.assert = function(ok, message) {
  if (ok !== true) return new Error(message || "Assertion failed");
};
