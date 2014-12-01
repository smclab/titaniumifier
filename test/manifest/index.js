
var manifest = require('../../manifest');

require('colors');

var diff = require('diff');
var should = require('should');

var path = require('path');
var fs = require('fs');
var readFile = fs.readFileSync;
var readdir = fs.readdirSync;

var fixturesDir = path.resolve(__dirname, 'fixtures');

var cfgs = readdir(fixturesDir).sort().map(function (filename) {
	filename = path.resolve(fixturesDir, filename);
	return {
		filename: path.relative(__dirname, filename),
		fullFilename: filename,
		package: require(filename)
	};
});

describe("Cases:", function () {
	cfgs.forEach(function (cfg) {
		it(cfg.filename, function () {
			var invalidPackage = cfg.filename.indexOf('INVALID') >= 0;

			if (invalidPackage) {
				(function () {
					build(cfg.filename, cfg.fullFilename, cfg.package, invalidPackage);
				}).should.throw();
			}
			else {
				build(cfg.filename, cfg.fullFilename, cfg.package, invalidPackage);
			}
		});
	});
});

function build(filename, fullFilename, pkg, invalidPackage) {

	manifest.validatePackage(pkg);

	if (invalidPackage) {
		return;
	}

	var expectedFilename = fullFilename
	.replace('fixtures', 'expected')
	.replace('package', 'manifest')
	.replace('.json', '');

	var result = manifest.buildFromPackage(pkg).trim();

	var expected = readFile(expectedFilename, 'utf8').trim()
	.replace('$YEAR$', new Date().getFullYear());

	var resultLines = result.split('\n');
	var expectedLines = expected.split('\n');

	resultLines.forEach(function (line, i) {
		line.should.be.eql(expectedLines[i]);
	});

	/*var err;

	if (result !== expected) {

		err = new Error("Wrong results for " + filename);
		err.data = [];

		err.data.push("\n");
		err.data.push(filename.green + "\n");
		err.data.push(path.relative(__dirname, expectedFilename).red + "\n");
		err.data.push("\n");

		diff.diffLines(expected, result).forEach(function(part){
			// green for additions, red for deletions
			// grey for common parts
			var color =
			part.added ? 'green' :
			part.removed ? 'red' :
			'white';

			if (part.added || part.removed) {
				err.data.push(expose(part.value, color));
			}
			else {
				err.data.push(part.value[color]);
			}
		});

		err.data.push("\n");
		err.data.push("\n");

		throw err;
	}*/
}

function expose(line, color) {
	line = replace(line, ' ', '·', color);
	line = replace(line, '\t', '----', color);
	return line;
}

function replace(line, from, to, color) {
	return line.split(from).map(function (piece, index) {
		if (index) {
			return to.grey + piece[color];
		}
		else {
			return piece[color];
		}
	}).join('');
}
