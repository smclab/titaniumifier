
var path = require('path');

var browserify = require('browserify');
var titaniumResolve = require('titanium-resolve');
var when = require('when');
var nodefn = require('when/node/function');

var fs = require('./util/fs');

var GLOBAL_VARS = require('./globals');
var PRELUDE_PATH = path.resolve(__dirname, 'util', '_prelude.js');
var PRELUDE_SRC = require('fs').readFileSync(PRELUDE_PATH, 'utf8');

module.exports = pack;

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
      }
    });
  });
}

function addDeps(to, deps) {
  if (Array.isArray(deps)) {
    return to.push(deps);
  }
  else if (deps) {
    return to.push(Object.keys(deps));
  }
}

// cfg = {
//   noDependencies // do not pack dependencies with it
//   useTitaniumPlatformResolve // TODO
//   debug // build source maps
// }

function pack(entry, cfg, callback) {
  var promise = getPackage(entry).then(function (data) {

    var entry = path.dirname(data.path);
    var pkg = data.pkg;

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

    opts.transforms = opts.transforms.map(function (tr) {
      return require(tr);
    });

    var b = browserify({
      resolve: titaniumResolve,
      extensions: opts.extensions
    });

    opts.transforms.forEach(function (transform) {
      b.transform(transform);
    });

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

    return [b, cfg, opts, entry, pkg];

  })
  .spread(function (b, cfg, opts, entry, pkg) {

    var entrypoint = path.resolve(entry, pkg.main || 'index.js');

    return when.promise(function (resolve, reject) {
      titaniumResolve(entrypoint, {
        paths: b._paths,
        modules: b._builtins,
        filename: path.resolve(entry, 'package.json'),
        extensions: opts.extensions
      }, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      })
    })
    .then(function (result) {
      b.add(result);
      return [b, cfg, opts, entry, pkg];
    });
  })
  .spread(function (b, cfg, opts, entry, pkg) {
    return nodefn.call(b.bundle.bind(b), {
      debug: cfg.debug,
      insertGlobalVars: GLOBAL_VARS,
      ignoreMissing: !!opts.ignoreMissing,
      standalone: pkg.name,
      prelude: PRELUDE_SRC,
      preludePath: PRELUDE_PATH
    });
  });

  if (callback) {
    promise.done(callback.bind(null, null), callback.bind(null));
  }
  else {
    return promise;
  }
}
