var cream = require('../');
var should = require('should');
var cns = require('cream-and-sugar');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var stream = require('stream');
require('mocha');

var createFile = function (filepath, contents) {
  var base = path.dirname(filepath);
  return new gutil.File({
    path: filepath,
    base: base,
    cwd: path.dirname(base),
    contents: contents
  });
};

describe('gulp-cns', function() {
  describe('cream()', function() {
    before(function() {
      this.testData = function (expected, newPath, done) {
        var newPaths = [newPath],
            expectedSourceMap;

        if (expected.v3SourceMap) {
          expectedSourceMap = JSON.parse(expected.v3SourceMap);
          expected = [expected.js];
        } else {
          expected = [expected];
        }

        return function (newFile) {
          this.expected = expected.shift();
          this.newPath = newPaths.shift();

          should.exist(newFile);
          should.exist(newFile.path);
          should.exist(newFile.relative);
          should.exist(newFile.contents);
          newFile.path.should.equal(this.newPath);
          newFile.relative.should.equal(path.basename(this.newPath));
          String(newFile.contents).should.equal(this.expected);

          if (expectedSourceMap) {
            // check whether the sources from the cns have been
            // applied to the files source map
            newFile.sourceMap.sources
              .should.containDeep(expectedSourceMap.sources);
          }

          if (done && !expected.length) {
            done.call(this);
          }
        };
      };
    });

    it('should concat two files', function(done) {
      var filepath = '/home/jgnewman/test/file.cns';
      var contents = new Buffer('a = 2');
      var expected;

      cns.compileCode(String(contents), function (err, result) {
        expected = result;
      }, {finalize: true});

      cream()
        .on('error', done)
        .on('data', this.testData(expected, path.normalize('/home/jgnewman/test/file.js'), done))
        .write(createFile(filepath, contents));
    });

    it('should emit errors correctly', function(done) {
      var filepath = '/home/jgnewman/test/file.cns';
      var contents = new Buffer('if a()\r\n  then huh');

      cream()
        .on('error', function(err) {
          err.message.slice(0, 11).should.equal('Parse error');
          done();
        })
        .on('data', function(newFile) {
          throw new Error('no file should have been emitted!');
        })
        .write(createFile(filepath, contents));
    });

    // it('should compile a file', function(done) {
    //   var filepath = 'test/fixtures/sanitycheck.cns';
    //   var contents = new Buffer(fs.readFileSync(filepath));
    //   var expected;
    //
    //   cns.compileCode(String(contents), function (err, result) {
    //     expected = result;
    //   }, {finalize: true});
    //
    //   cream()
    //     .on('error', done)
    //     .on('data', this.testData(expected, path.normalize('test/fixtures/sanitycheck.js'), done))
    //     .write(createFile(filepath, contents));
    // });

    // Gonna need this later when we have source maps.

    // it('should compile a file with source map', function(done) {
    //   var filepath = 'test/fixtures/sanitycheck.cns';
    //   var contents = new Buffer(fs.readFileSync(filepath));
    //   var expected = cns.compileCode(String(contents), {
    //     sourceMap: true,
    //     sourceFiles: ['sanitycheck.cns'],
    //     generatedFile: 'sanitycheck.js'
    //   });
    //
    //
    //   var stream = sourcemaps.init();
    //   stream.write(createFile(filepath, contents));
    //   stream
    //     .pipe(cream())
    //       .on('error', done)
    //       .on('data', this.testData(expected, path.normalize('test/fixtures/sanitycheck.js'), done));
    // });

  });
});
