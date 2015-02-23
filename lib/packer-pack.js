'use strict';

var Promise = require('bluebird');
var browserify = require('browserify');
var path = require('path');
var titaniumResolve = require('titanium-resolve');

var fs = require('./util/fs');

var BUILTINS = require('./builtins');
var GLOBAL_VARS = require('./globals');
var PRELUDE_PATH = path.resolve(__dirname, 'util', '_prelude.js');
var PRELUDE_SRC = require('fs').readFileSync(PRELUDE_PATH, 'utf8');

var has = Object.prototype.hasOwnProperty;

module.exports = pack;
module.exports.getBundle = getBundle;

function getPackage(entryfile) {
  return fs.isFile(entryfile).then(function (isFile) {
    if (isFile) return entryfile;
    else return path.resolve(entryfile, 'package.json');
  })
  .then(function (entry) {
    return fs
    .readFile(entry, 'utf8')
    .then(JSON.parse)
    .then(function (pkg) {
      return {
        path: entry,
        pkg: pkg
      };
    });
  });
}

function addDeps(to, deps) {
  if (Array.isArray(deps)) {
    deps.forEach(function (dep) {
      to.push(dep);
    });
  }
  else if (typeof deps === 'string') {
    to.push(deps);
  }
  else if (deps) {
    addDeps(to, Object.keys(deps));
  }
}

// cfg = {
//   noDependencies // do not pack dependencies with it
//   useTitaniumPlatformResolve // TODO
//   debug // build source maps
// }

function getBundle(entry, cfg) {
  return getPackage(entry).then(function (data) {

    var entry = path.dirname(data.path);
    var pkg = data.pkg;
    var titaniumManifest = pkg.titaniumManifest || {};

    var moduleid = titaniumManifest.moduleid || pkg.name;

    var opts = pkg.titaniumifier || pkg.npmifier || pkg.browserify || {};

    opts.extensions || (opts.extensions = [ '.js', '.json' ]);
    opts.transforms || (opts.transforms = []);
    opts.ignores || (opts.ignores = []);
    opts.externals || (opts.externals = []);

    var addExternals = addDeps.bind(null, opts.externals);

    addExternals(pkg.peerDependencies);
    addExternals(pkg.nativeDependencies);

    if (cfg.noDependencies) {
      addExternals(pkg.dependencies);
      addExternals(pkg.devDependencies);
      addExternals(pkg.optionalDependencies);
    }

    opts.ignoreMissing = !!opts.ignoreMissing;

    var b = browserify({
      builtins: BUILTINS,
      debug: cfg.debug,
      extensions: opts.extensions,
      insertGlobalVars: GLOBAL_VARS,
      ignoreMissing: false,
      standalone: (cfg.standalone === false) ? undefined : moduleid,
      prelude: PRELUDE_SRC,
      preludePath: PRELUDE_PATH
    });

    b.plugin(fixResolver, {
      resolve: titaniumResolve
    });

    if (Array.isArray(opts.transforms)) {
      opts.transforms.forEach(function (transform) {
        b.transform(transform);
      });
    }
    else {
      Object.keys(opts.transforms).forEach(function (transform) {
        b.transform(transform, opts.transforms[ transform ]);
      });
    }

    opts.ignores.forEach(function (ignore) {
      b.ignore(ignore);
    });

    opts.externals.forEach(function (external) {
      b.exclude(external);
    });

    if (cfg.useTitaniumPlatformResolve) {
      TODO;
      /*b.transform(titaniumPlatformResolve.createTransform({
        platforms: [ build.platformName ],
        extensions: opts.extensions
      }));*/
    }

    return {
      entry: entry,
      pkg: pkg,
      opts: opts,
      bundle: b
    };
  });
}

function pack(entry, cfg, callback) {
  cfg || (cfg = {});
  var promise = getBundle(entry, cfg).then(function (data) {

    var entry = data.entry;
    var pkg = data.pkg;
    var b = data.bundle;
    var opts = data.opts;

    var entrypoint = path.resolve(entry, pkg.main || 'index.js');

    var passedPackages = {};
    var nativeDependencies = clone(pkg.nativeDependencies);

    b.on('package', function (pkg) {
      // consider only interesting packages
      if (!pkg.nativeDependencies) return;
      // pass only once per package
      if (has.call(passedPackages, pkg.__dirname)) return;
      passedPackages[ pkg.__dirname ] = true;
      // merge dependencies
      Object.keys(pkg.nativeDependencies).forEach(function (key) {
        // TODO better error/collision check
        if (has.call(nativeDependencies, key)) return;
        nativeDependencies[ key ] = pkg.nativeDependencies[ key ];
      });
    });

    return new Promise(function (resolve, reject) {
      titaniumResolve(entrypoint, {
        paths: b._mdeps.paths,
        modules: b._mdeps.options.modules,
        filename: path.resolve(entry, 'package.json'),
        extensions: opts.extensions
      }, function (err, result) {
        if (err) return reject(err);

        b.add(result);

        b.bundle(function (err, result) {
          if (err) return reject(err);
          resolve(result);
        });
      });
    })
    .then(function (result) {
      return {
        source: result,
        nativeDependencies: nativeDependencies
      };
    });
  });

  if (callback) {
    promise.done(callback.bind(null, null), callback.bind(null));
  }

  return promise;
}

function clone(obj) {
  return (obj == null) ? {} : Object.keys(obj).reduce(function (memo, key) {
    memo[ key ] = obj[ key ];
    return memo;
  }, {});
}

function fixResolver(b, opts) {
  b._mdeps.resolver = (opts.resolve || b._mdeps.resolver);
}
