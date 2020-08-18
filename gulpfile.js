const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webP = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const uglify = require("gulp-uglify-es").default;

//Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
};

exports.scripts = scripts;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Images

const images = () => {
  return gulp.src(["build/img/**/*{jpg,png,svg}", "!build/img/**/sprite.svg"])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
};

exports.images = images;

// WebP

const webp = () => {
  return gulp.src("build/img/**/*{jpg,png}")
    .pipe(webP({ quality: 80 }))
    .pipe(gulp.dest("build/img"))
};

exports.webp = webp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            removeAttrs: { attrs: ['fill'] }
          }
        ]
      })
    ]))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
};

exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*{woff,woff2}",
    "source/img/**",
    "source/*.ico",
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(clean, styles, copy));
  gulp.watch("source/*.html").on("change", gulp.series(copy, sync.reload));
  gulp.watch(["source/js/**/*.js", "!source/js/**/*min.js"], gulp.series(scripts));
};

// Build

const build = (done) => {
  gulp.series(clean, gulp.parallel(copy, styles, scripts), gulp.parallel(images, sprite), webp)(done);
};

exports.build = build;

exports.default = gulp.series(
  build, gulp.parallel(server, watcher)
);
