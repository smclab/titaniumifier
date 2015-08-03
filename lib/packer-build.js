'use strict';

var fs = require('./util/fs');
var manifest = require('./manifest');
var pack = require('./packer-pack');

var AdmZip = require('adm-zip');
var Promise = require('bluebird');
var path = require('path');

var UNKNOWN_LICENSE = 'Unknown License';

module.exports = build;

function build(cfg) {
  return Promise.props(cfg)
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

    return Promise.props(cfg);
  })
  .then(function (cfg) {

    cfg.packed = pack(cfg.entry, cfg);

    return Promise.props(cfg);
  })
  .then(function (cfg) {

    var titaniumManifest = cfg.package.titaniumManifest || {};

    var moduleid = titaniumManifest.moduleid || cfg.package.name;
    var version = cfg.package.version + (cfg.noDependencies ? '-bare' : '');
    var pkg = cfg.package;

    cfg.bundlename = moduleid + '.js';
    cfg.zipname = (moduleid + '-commonjs-' + version + '.zip').toLowerCase();
    cfg.internalPath = 'modules/commonjs/' + moduleid + '/' + version;

    pkg._nativeDependencies = cfg.packed.nativeDependencies;
    pkg.main = cfg.bundlename;

    var zip = new AdmZip();

    zip.addLocalFolderToModule = addLocalFolderToModule.bind(null, zip, cfg);
    zip.addFileToModule = addFileToModule.bind(null, zip, cfg);
    zip.writeModule = writeModule.bind(null, zip, cfg);
    zip.writeBundle = writeBundle.bind(null, zip, cfg);

    zip.addFileToModule('/manifest', cfg.manifest);
    zip.addFileToModule('/package.json', JSON.stringify(cfg.package, null, 2));
    zip.addFileToModule('/' + cfg.bundlename, cfg.packed.source);
    zip.addFileToModule('/LICENSE', cfg.license);

    var directories = pkg.directories || {};

    var exampleDir = directories.example || 'example';
    var documentationDir = directories.documentation || 'documentation';

    exampleDir = path.resolve(cfg.entry, exampleDir);
    documentationDir = path.resolve(cfg.entry, documentationDir);

    return Promise.all([
      fs.isDirectory(exampleDir),
      fs.isDirectory(documentationDir)
    ]).spread(function (hasExample, hasDocumentation) {
      if (hasExample) {
        zip.addLocalFolderToModule(exampleDir, '/example');
      }

      if (hasDocumentation) {
        zip.addLocalFolderToModule(documentationDir, '/documentation');
      }

      return zip;
    });
  });
}

function addLocalFolderToModule(zip, cfg, localPath, zipPath) {
  zipPath = cfg.internalPath + zipPath;
  return zip.addLocalFolder(localPath, zipPath);
}

function addFileToModule(zip, cfg, filename, content, comment) {
  filename = cfg.internalPath + filename;
  content = Buffer.isBuffer(content) ? content : (new Buffer(content));
  return zip.addFile(filename, content, comment);
}

function writeBundle(zip, cfg, dir) {
  return fs.writeFile(
    path.resolve(dir, cfg.bundlename), cfg.packed.source, 'utf8');
}

function writeModule(zip, cfg, dir) {
  return fs.writeFile(path.resolve(dir, cfg.zipname), zip.toBuffer(), 'binary');
}

function getLicense(cfg) {
  return Promise.resolve(cfg.entry)
  .then(function (entry) {
    return fs.readFile(path.resolve(entry, 'LICENSE'), 'utf8');
  })
  .catch(isENOENT, function (err) {
    return UNKNOWN_LICENSE;
  });
}

function isENOENT(err) {
  return ((err.cause || err).code === 'ENOENT');
}

function getPackage(cfg) {
  return Promise.resolve(cfg.entry)
  .then(function (entry) {
    return fs.readFile(path.resolve(entry, 'package.json'), 'utf8');
  })
  .then(JSON.parse);
}

function getManifest(cfg) {
  return Promise.resolve(cfg.package)
  .then(manifest.validatePackage)
  .then(manifest.buildFromPackage);
}
