"use strict"

const { param } = require('jquery');

// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require('gulp'),
  loadPlugins = require('gulp-load-plugins'),
  plugins = loadPlugins(),
  _ = require('lodash'),
  del = require('del'),
  browserSync = require('browser-sync'),
  readline = require('readline');

const clean = () => {
  return del(['dist', 'temp']);
};

const styles = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass())
    .pipe(dest('temp'));
};

const scripts = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(plugins.uglify())
    .pipe(dest('temp'));
};
const html = () => {
  return src(['src/**/*.html'], { base: 'src' })
    .pipe(plugins.swig({ defaults: { cache: false } }))
    .pipe(dest('temp'));
};
const compile = parallel(styles, scripts, html);

const useref = () => {
  return src('temp/*.html')
    .pipe(plugins.useref({ searchPath: 'temp' }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin()))
    .pipe(dest('dist'));
};
const others = () => {
  return src(['src/assets/images/*', 'src/assets/fonts/*'], { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
};
const extra = () => {
  return src('public/**/*')
    .pipe(dest('dist'));
};


const lint = () => {
  return src(['**/*.js', '!node_modules/**'])
    .pipe(plugins.eslint(
      {
        fix: true,
        rules: {
          'strict': 2,
          "camelcase": 2,
        },
        globals: [
          'jQuery',
          '$'
        ],
        envs: [
          'browser',
          'node'
        ],
        "parserOptions": {
          "ecmaVersion": 2018
        }
      }
    ))
    .pipe(plugins.eslint.format())
};

const deploy = () => {
  return new Promise((res, rej) => {
    const ak = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    let params = { hostname: '', destination: '', port: '' }
    let values = Object.keys(params), i = 0
    let fn = (q) => {
      ak.question(`${q}:  `, (a) => {
        i++
        params[q] = a
        if (i < values.length) {
          fn(values[i])
        } else {
          ak.close()
        }
      })
    }
    fn(values[i])
    ak.on('close', () => {
      src('dist/**')
        .pipe(plugins.rsync({
          root: 'dist',
          hostname: params.hostname || 'localhost',
          destination: params.destination || '/',
          port: params.port || 3000
        }))
      res()
    })
  })

}

const serve = () => {
  const bs = browserSync.create(),
    updateFile = _.curry((fn) => fn.pipe(bs.reload({ stream: true })))
  watch('src/*.html', _.flowRight(updateFile, html))
  watch('src/assets/styles/*.scss', _.flowRight(updateFile, styles))
  watch('src/assets/scripts/*.js', _.flowRight(updateFile, scripts))
  bs.init({
    port: 2020,
    open: false,
    server: {
      baseDir: ['temp', 'src', 'extra'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
};
const start = series(compile, serve);
const build = series(clean, parallel(series(compile, useref), others, extra));

module.exports = {
  clean,
  build,
  serve,
  start,
  lint,
  deploy
};
