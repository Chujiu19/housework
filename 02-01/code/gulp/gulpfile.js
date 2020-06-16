// 实现这个项目的构建任务
const { src, dest, series, parallel } = require('gulp');
const del = require('del')
const browserSync = require('browser-sync')
const bs = browserSync()
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const clean = () => {
  return del(['dist', 'temp'])
}
const styles = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass())
    .pipe(dest('dist'))
}
const scripts = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(plugins.uglify())
    .pipe(dest('dist'))
}
const others = () => {
  return src(['src/assets/images/*', 'src/assets/fonts/*'], { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const html = () => {
  return src(['src/**/*.html'], { base: 'src' })
    .pipe(plugins.swig())
    .pipe(plugins.useref({
      searchPath: ['dist', 'src']
    }))
    .pipe(dest('dist'))
}
const public = () => {
  return src('public/**/*').pipe(dest('dist'))
}
const serve = () => {
  bs.init({
    port: 2020,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
const build = series(clean, parallel(styles, scripts, others, public, html))

module.exports = {
  clean,
  build,
  html,
  serve
}
