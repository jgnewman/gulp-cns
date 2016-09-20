[![Build Status](https://secure.travis-ci.org/jgnewman/gulp-cns.png?branch=master)](https://travis-ci.org/jgnewman/gulp-cns)

**gulp-cns is currently in alpha. Use at your own risk.**

## Information

<table>
<tr>
<td>Package</td><td>gulp-cns</td>
</tr>
<tr>
<td>Description</td>
<td>Compiles Cream & Sugar</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 4.0.0</td>
</tr>
</table>

## Usage

```javascript
var cream = require('gulp-cns');

gulp.task('cream', function() {
  gulp.src('./src/*.cns')
    .pipe(cream().on('error', gutil.log))
    .pipe(gulp.dest('./public/'));
});
```

### Error handling

gulp-cns will emit an error for cases such as invalid Cream & Sugar syntax. If uncaught, the error will crash gulp.

You will need to attach a listener (i.e. `.on('error')`) for the error event emitted by gulp-cns:

```javascript
var cnsStream = cream();

// Attach listener
cnsStream.on('error', function(err) {});
```

In addition, you may utilize [gulp-util](https://github.com/wearefractal/gulp-util)'s logging function:

```javascript
var gutil = require('gulp-util');

// ...

var cnsStream = cream();

// Attach listener
cnsStream.on('error', gutil.log);

```

Since `.on(...)` returns `this`, you can compact it as inline code:

```javascript

gulp.src('./src/*.cns')
  .pipe(cream().on('error', gutil.log))
  // ...
```

## Source maps

> As of now, source maps are not supported. But we will be supporting them soon and when we do, they'll work like the following:

gulp-cns can be used in tandem with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) to generate source maps for the CnS to javascript transition. You will need to initialize [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) prior to running the gulp-cns compiler and write the source maps after.

```javascript
var sourcemaps = require('gulp-sourcemaps');

gulp.src('./src/*.cns')
  .pipe(sourcemaps.init())
  .pipe(cream())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dest/js'));

// will write the source maps inline in the compiled javascript files
```

By default, [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) writes the source maps inline in the compiled javascript files. To write them to a separate file, specify a relative file path in the `sourcemaps.write()` function.

```javascript
var sourcemaps = require('gulp-sourcemaps');

gulp.src('./src/*.cns')
  .pipe(sourcemaps.init())
  .pipe(cream()).on('error', gutil.log)
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./dest/js'));

// will write the source maps to ./dest/js/maps
```

## LICENSE

(MIT License)

Copyright (c) 2016 John Newman

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
