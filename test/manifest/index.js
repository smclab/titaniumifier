
var manifest = require('../../manifest');

var should = require('should');

var path = require('path');
var fs = require('fs');

describe("Cases:", function () {
	var fixturesDir = path.resolve(__dirname, 'fixtures');

	fs.readdirSync(fixturesDir).forEach(function (filename) {
		var fullname = path.resolve(fixturesDir, filename);
		var invalidPackage = filename.indexOf('INVALID') >= 0;

		it(filename, function () {
			var pkg = JSON.parse(fs.readFileSync(fullname, 'utf8'));

			// Validation

			if (invalidPackage) {
				validate.should.throw();
				return;
			}
			else {
				validate();
			}

			// Building

			build(filename, fullname, pkg);

			function validate() {
				manifest.validatePackage(pkg);
			}
		});
	});
});

function build(filename, fullname, pkg) {
	var expectedFilename = fullname
	.replace('fixtures', 'expected')
	.replace('package', 'manifest')
	.replace('.json', '');

	var result = manifest.buildFromPackage(pkg).trim();

	var expected = fs.readFileSync(expectedFilename, 'utf8')
	.trim()
	.replace('$YEAR$', new Date().getFullYear());

	var resultLines = result.split('\n');
	var expectedLines = expected.split('\n');

	resultLines.forEach(function (line, i) {
		line.should.be.eql(expectedLines[i]);
	});
}
