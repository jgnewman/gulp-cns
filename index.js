var through = require('through2');
var cns = require('cream-and-sugar');
var gutil = require('gulp-util');
var applySourceMap = require('vinyl-sourcemaps-apply');
var path = require('path');
var merge = require('merge');

var PluginError = gutil.PluginError;

module.exports = function () {
  function replaceExtension(path) {
    return gutil.replaceExtension(path, '.js');
  }

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-cns', 'Streaming not supported'));

    var data;
    var err;
    var str = file.contents.toString('utf8');
    var dest = replaceExtension(file.path);

    cns.compileCode(str, function (e, result) {
      if (e) {
        err = e;
      } else {
        data = result;
      }
    }, {finalize: true});

    if (err) {
      return cb(new PluginError('gulp-cns', err));
    }

    // Be ready to support source maps in the future
    if (data && data.v3SourceMap && file.sourceMap) {
      applySourceMap(file, data.v3SourceMap);
      file.contents = new Buffer(data.js);
    } else {
      file.contents = new Buffer(data);
    }

    file.path = dest;
    cb(null, file);
  }

  return through.obj(transform);
};
