'use strict';

var semver = require('semver');
var guid = require('guid');

var DEFAULT_MIN_SDK = '3.2.0.GA';

exports.buildFromPackage = buildFromPackage;
exports.buildManifest = buildManifest;
exports.validatePackage = validatePackage;

function validatePackage(pkg) {
  var titaniumManifest = pkg.titaniumManifest || {};

  if (!titaniumManifest.guid && !pkg.guid) {
    throw new Error("No `guid` found. Here’s one for you: " + guid.raw());
  }

  if (!pkg.name) {
    throw new Error("No `name` found!");
  }

  return pkg;
}

function buildFromPackage(pkg) {
  var authorObj = getAuthorFromPackage(pkg);

  var titaniumManifest = pkg.titaniumManifest || {};

  var version = pkg.version;
  var description = pkg.description;
  var author = getAuthorFull(authorObj);
  var license = getLicenseFromPackage(pkg);
  var copyright = getCopyrightFromPackage(pkg);
  var name = titaniumManifest.name || pkg.name;
  var moduleid = titaniumManifest.moduleid || pkg.name;
  var guid = titaniumManifest.guid || pkg.guid;
  var platform = 'commonjs';
  var minsdk = getMinSDK(pkg);

  return buildManifest({
    'version': version,
    'description': description,
    'author': author,
    'license': license,
    'copyright': copyright,
    'name': name,
    'moduleid': moduleid,
    'guid': guid,
    'platform': platform,
    'minsdk': minsdk
  });
}

function buildManifest(data) {
  return Object.keys(data).map(function (key) {
    var value = data[key];
    return key + ':' + (value ? (' ' + value) : '');
  }).join('\n');
}

function getCopyrightFromPackage(pkg) {
  if (pkg.copyright) {
    return pkg.copyright;
  }
  else {
    var year = new Date().getFullYear();
    var author = getAuthorName(getAuthorFromPackage(pkg));
    return [
      'Copyright', '©', year, author
    ].join(' ');
  }
}

function getLicenseFromPackage(pkg) {
  if (pkg.license) {
    return licenseToString(pkg.license);
  }
  else if (pkg.licenses) {
    return pkg.licenses.map(licenseToString).join(', ');
  }
}

function licenseToString(license) {
  if (typeof license === 'string') {
    return license;
  }
  else if (typeof license === 'object') {
    return license.type;
  }
  else {
    return '-';
  }
}

function getAuthorFromPackage(pkg) {
  var author = pkg.author;
  var contributors = pkg.contributors;

  if (author) {
    return author;
  }
  else if (contributors && contributors.length) {
    return contributors[0];
  }
  else {
    return {};
  }
}

function getAuthorName(author) {
  if (typeof author === 'string') {
    var pos;
    if ((pos = author.indexOf('<')) >= 0 ||
        (pos = author.indexOf('(')) >= 0) {

      return author.slice(0, pos).trim();
    }
    else {
      return author.trim();
    }
  }
  else {
    return (author.name || author.email || author.url || '-').trim();
  }
}

function getAuthorFull(author) {
  if (typeof author === 'string') {
    return author;
  }
  else {
    return [
      author.name,
      author.email && ('<' + author.email + '>'),
      author.url && ('(' + author.url + ')')
    ].filter(function (piece) {
      return piece;
    }).join(' ');
  }
}

function getMinSDK(pkg) {
  try {
    return semver.Range(pkg.engines.titaniumsdk).set[0][0].semver.format();
  }
  catch (e) {
    return DEFAULT_MIN_SDK;
  }
}

function licenseToString(license) {
  if (typeof license === 'string') {
    return license;
  }
  else if (typeof license === 'object') {
    return license.type;
  }
  else {
    return '-';
  }
}

function identity(o) {
  return o;
}
