
var path = require('path');

var AdmZip = require('adm-zip');
var when = require('when');
var keys = require('when/keys');

var fs = require('./util/fs');
var manifest = require('./manifest');
var pack = require('./packer-pack');

var UNKNOWN_LICENSE = 'Unknown License';

module.exports = build;

function build(cfg) {
  return keys.all(cfg)
  .then(function (cfg) {

    if (!cfg.entry) {
      throw new Error("No entry specified");
    }

    if (!cfg.package) {
      cfg.package = getPackage(cfg);
    }

    if (!cfg.manifest) {
      cfg.manifest = getManifest(cfg);
    }

    if (!cfg.license) {
      cfg.license = getLicense(cfg);
    }

    return keys.all(cfg);
  })
  .then(function (cfg) {

    cfg.packed = pack(cfg.entry, cfg);

    return keys.all(cfg);

  })
  .then(function (cfg) {

    var name = cfg.as || cfg.package.name;
    var version = cfg.package.version + (cfg.noDependencies ? '-bare' : '');

    cfg.zipname = name + '-commonjs-' + version + '.zip';
    cfg.internalPath = '/modules/commonjs/' + name + '/' + version;

    var zip = new AdmZip();

    zip.addFileToModule = addFileToModule.bind(zip, cfg);
    zip.writeModule = writeModule.bind(zip, cfg);

    zip.addFileToModule('/manifest', cfg.manifest);
    zip.addFileToModule('/package.json', JSON.stringify(cfg.package, null, 2));
    zip.addFileToModule('/' + name + '.js', cfg.packed);
    zip.addFileToModule('/LICENSE', cfg.license);

    return zip;

  });
}

function addFileToModule(cfg, filename, content, comment) {
  filename = cfg.internalPath + filename;
  content = Buffer.isBuffer(content) ? content : (new Buffer(content));
  return this.addFile(filename, content, comment);
}

function writeModule(cfg, dir) {
  return fs.writeFile(path.resolve(dir, cfg.zipname), this.toBuffer(), 'binary');
}

function getLicense(cfg) {
  return when(cfg.entry)
  .then(function (entry) {
    return fs.readFile(path.resolve(entry, 'LICENSE'), 'utf8');
  })
  .catch(function (err) {
    if (err.code === 'ENOENT') return UNKNOWN_LICENSE;
    else throw err;
  });
}

function getPackage(cfg) {
  return when(cfg.entry)
  .then(function (entry) {
    return fs.readFile(path.resolve(entry, 'package.json'), 'utf8');
  })
  .then(JSON.parse);
}

function getManifest(cfg) {
  return when(cfg.package)
  .then(function (package) {
    package = Object.create(package);
    package.name = (cfg.as || package.name);
    return package;
  })
  .then(manifest.validatePackage)
  .then(manifest.buildFromPackage);
}
