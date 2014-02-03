
var vm = require('vm');
var path = require('path');
var packer = require('../../packer');
var fs = require('../../lib/util/fs');

var Titanium = {
	API: {
		log: console.log.bind(console),
		info: console.log.bind(console),
		error: console.error.bind(console),
		warn: console.warn.bind(console),
		trace: console.trace.bind(console)
	}
};

packer.pack(path.resolve(__dirname, 'fake-module'), {
	//
})
.then(function (src) {
	return fs.writeFile(path.resolve(__dirname, 'build', 'packed.js'), src).yield(src);
})
.done(function (src) {
	var sandbox = {
		Titanium: Titanium,
		Ti: Titanium,
		module: {
			exports: {}
		}
	};

	sandbox.exports = sandbox.module.exports;

	vm.runInNewContext(src, sandbox, require.resolve('./fake-module'));
});
