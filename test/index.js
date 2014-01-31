
var manifest = require('../manifest');

require('colors');
var diff = require('diff');

var path = require('path');
var fs = require('fs');
var readFile = fs.readFileSync;
var readdir = fs.readdirSync;

var fixturesDir = path.resolve(__dirname, 'fixtures');

var cfgs = readdir(fixturesDir).map(function (filename) {
	filename = path.resolve(fixturesDir, filename);
	return {
		filename: filename,
		package: require(filename)
	};
});

cfgs.forEach(function (cfg) {
	try {
		manifest.validatePackage(cfg.package);

		var expectedFilename = cfg.filename
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
			err.data.push(expectedFilename.red + "\n");
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

		console.log(' ✔ '.green + cfg.filename.blue);
	}
	catch (e) {
		console.log(' ✘ '.red + cfg.filename.yellow);

		if (err.data) {
			process.stderr.write(err.data.join(''));
		}
		else {
			throw err;
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
