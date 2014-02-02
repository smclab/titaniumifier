
var manifest = require('../../manifest');

require('colors');
var diff = require('diff');

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

cfgs.forEach(function (cfg) {
	var invalidPackage = cfg.filename.indexOf('INVALID') >= 0;

	function ok(msg) {
		console.log(' ✔ '.green + cfg.filename.white);
		if (msg) {
			console.log(' · '.green + msg.blue);
		}
	}

	function notOk() {
		console.log(' ✘ '.red + cfg.filename.yellow);
	}

	var built = false;

	try {
		manifest.validatePackage(cfg.package);

		built = true;

		if (invalidPackage) {
			throw new Error("Building for " + cfg.filename + " should throw");
		}

		var expectedFilename = cfg.fullFilename
			.replace('fixtures', 'expected')
			.replace('package', 'manifest')
			.replace('.json', '');

		var result = manifest.buildFromPackage(cfg.package).trim();

		var expected = readFile(expectedFilename, 'utf8').trim()
			.replace('$YEAR$', new Date().getFullYear());

		var err;

		if (result !== expected) {

			err = new Error("Wrong results for " + cfg.filename);
			err.data = [];

			err.data.push("\n");
			err.data.push(cfg.filename.green + "\n");
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
		}

		ok();
	}
	catch (err) {
		if (invalidPackage && !built) {
			ok(err.message ? ('Correctly throws: ' + err.message) : 'Correctly throws error');
			return;
		}
		else {
			notOk();

			if (err.data) {
				process.stderr.write(err.data.join(''));
			}
			else {
				throw err;
			}
		}
	}
});

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

console.log('');
