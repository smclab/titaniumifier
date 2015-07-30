
exports.cliVersion = '>= 3.4.0';

exports.init = function babel$init(logger, config, cli, nodeappc) {

  var fs = require('fs');
  var path = require('path');
  var touch = require("touch");
  var mkdirp = require('mkdirp');

  var packer = require('../../packer');

  var has = Object.prototype.hasOwnProperty;

  var APP_CONTENT = 'require("bundled_dependencies")("app_js")';
  var PREFIX = "[titaniumifier] ".grey;

  var resolved = {};
  var resolvedIds = {};

  var jsanalyze;

  function getId(ctx, filename) {
    var resourcesDir = path.resolve(ctx.projectDir, 'Resources');
    var id = path.relative(resourcesDir, filename);

    return id.replace(/[\.\/]/g, '_');
  }

  function getConsumer(id) {
    return 'require("bundled_dependencies")(' + JSON.stringify(id) + ')';
  }

  cli.on('build.pre.compile', {
    pre: function titaniumifier$compile$pre(data, callback) {

      var ctx = data;

      var platform = ctx.platformName;

      if (platform === 'iphone' || platform === 'ipad') {
        platform = 'ios';
      }

      ctx.titaniumifierDir = path.resolve(ctx.projectDir, 'build', 'titaniumifier');
      ctx.titaniumifierBuildDir = path.resolve(ctx.titaniumifierDir, platform);

      ctx.swallowFrom = path.resolve(ctx.titaniumifierDir, '.swallowFrom');
      ctx.swallowTo = path.resolve(ctx.titaniumifierDir, '.swallowTo');

      ctx.titaniumifierAppFilename = path.resolve(ctx.titaniumifierDir, 'app.js');
      ctx.titaniumifierMain = path.resolve(ctx.projectDir, 'Resources', 'app.js');

      ctx.bundleLocation = path.resolve(ctx.projectDir, 'Resources', platform, 'bundled_dependencies.js');

      mkdirp.sync(ctx.titaniumifierBuildDir);
      mkdirp.sync(path.dirname(ctx.swallowFrom));
      touch.sync(ctx.swallowFrom);

      logger.trace(PREFIX + "Do we need to encrypt? (%s)", String(ctx.encryptJS ? 'yes' : 'no').cyan);

      /*if (platform === 'ios') {
        ctx.finalBundleLocation = (
          ctx.encryptJS ?
          path.resolve(ctx.buildAssetsDir, 'bundled_dependencies') :
          path.resolve(ctx.xcodeAppDir, 'bundled_dependencies.js')
        );

        if (ctx.encryptJS) {
          mkdirp.sync(ctx.xcodeAppDir);
        }
      }
      else if (platform === 'android') {
        TODO;
      }
      else {
        TODO;
      }*/

      packer.pack.getBundle(ctx.projectDir, {
        standalone: false,
        exportRequire: true,
        basedir: ctx.projectDir
      }).then(function (data) {
        var pkg = data.pkg;
        var b = data.bundle;

        // TODO package.files is a terribly wrong idea!
        var filesOriginal = (pkg.files || [ pkg.main || 'Resources/app.js' ]);

        var files = filesOriginal.map(function (f) {
          var file = path.resolve(ctx.projectDir, f);
          var id = getId(ctx, file);
          var consumer = path.resolve(ctx.titaniumifierBuildDir, id);
          var consumerSource = getConsumer(id);

          logger.debug(PREFIX + "Writing: %s", String(id).cyan);
          logger.trace(PREFIX + "File location: %s", String(consumer).cyan);

          resolvedIds[ file ] = consumer;

          mkdirp.sync(path.dirname(consumer));
          fs.writeFileSync(consumer, consumerSource);

          return {
            id: id,
            file: file,
            consumer: consumer,
            consumerSource: consumerSource
          };
        });

        (ctx.tiapp.modules || []).forEach(function (nativeModule) {
          logger.debug(PREFIX + "Module %s is considered external", nativeModule.id.cyan);

          b.external(nativeModule.id);
        });

        b.pipeline.get('deps').on('data', function (data) {
          resolved[ data.file ] = data.entry;
        });

        b.require(files.map(function (row) {
          return {
            file: row.file,
            entry: false,
            expose: row.id
          };
        }));

        b.bundle(function (err, result) {
          err && logger.error(err);
          if (err) return callback(err);

          mkdirp.sync(path.dirname(ctx.bundleLocation));

          fs.writeFile(ctx.bundleLocation, result, function (err) {;
            err && logger.error(err);
            callback(err);
          });
        });
      })
      .catch(function (err) {
        callback(err);
      });

      /*jsanalyze = require(ctx.titaniumSdkPath + '/node_modules/titanium-sdk/lib/jsanalyze');
      // use it this way:
      // jsanalyze.analyzeJsFile(data.file, { minify: ctx.minifyJS });*/
    }
  });

  cli.on('build.ios.copyResource', {
    pre: titaniumifier$copyResource$pre
  });

  cli.on('build.android.copyResource', {
    pre: titaniumifier$copyResource$pre
  });

  function titaniumifier$copyResource$pre(data, callback) {
    var args = data.args;

    var jsFilesToEncrypt = this.jsFilesToEncrypt;

    var from = args[0];
    var to = args[1];

    var ctx = data.ctx;
    var ext = path.extname(from);

    var fromResources = path.relative(path.resolve(ctx.projectDir, 'Resources'), from);

    var isFromResources = (fromResources.charAt(0) !== '.');

    if (has.call(resolvedIds, from)) {
      logger.info(PREFIX + "Replacing %s", from.cyan);

      data.args[0] = resolvedIds[ from ];
    }
    else if (!isFromResources || (from === ctx.bundleLocation)) {
      // do nothing if it’s the bundle or if it’s a module
    }
    else if (has.call(resolved, from) && !resolved[ from ]) {
      logger.debug(PREFIX + "Swallowing %s", from.cyan);

      data.args[0] = ctx.swallowFrom;
    }
    else if (ext === '.js') {
      logger.warn(PREFIX + "File %s is lost", from.cyan);

      data.args[0] = ctx.swallowFrom;
    }

    this.jsFilesToEncrypt = jsFilesToEncrypt;

    callback(null);
  }

};
