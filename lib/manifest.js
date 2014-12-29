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

  getMinSDKFromPackage(pkg);

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
  var minsdk = getMinSDKFromPackage(pkg);

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

function getMinSDKFromPackage(pkg) {
  if (pkg.engines && pkg.engines.titaniumsdk) {
    return getMinSDK(pkg.engines.titaniumsdk);
  }
  else {
    return DEFAULT_MIN_SDK;
  }
}

function getMinSDK(titaniumsdk) {
  var range;

  try {
    range = semver.Range(titaniumsdk);
  }
  catch (e) {
    throw new Error(
      "Invalid SDK version '" + titaniumsdk + "'. Did you include '.GA' or" +
      " similar?");
  }

  var gteVersions = [];
  var minsdk;

  range.set.forEach(function (set) {
    set.forEach(function (comp) {
      if (comp.operator === '>=') {
        gteVersions.push(comp.semver.format());
      }
      else if (comp.operator === '>') {
        throw new Error(
          "Invalid SDK version '" + titaniumsdk + "'. Only" +
          " equal-or-greater-then ranges are valid.");
      }
      else {
        // we skip these, because could be a byproduct of '1.0.*', which will
        // be parsed into [ '>= 1.0.0', '< 1.1.0' ]
      }
    });
  });

  if (gteVersions.length === 0) {
    throw new Error(
      "Invalid SDK version '" + titaniumsdk + "'. Use something in the form" +
      " '>= 3.4.0' or '3.4.*'.");
  }
  if (gteVersions.length > 1) {
    // we get only the lowest of all the ranges we get (this should be a
    // warning…)
    minsdk = gteVersions.sort(semver.compareLoose)[ 0 ];
  }
  else {
    minsdk = gteVersions[ 0 ];
  }

  // the build at the of the version is almost useless, .GA is the way to go
  // because if the user has an RC installed it will work anyway
  return minsdk + '.GA'
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
