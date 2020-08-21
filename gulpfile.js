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

// Prepare a file with scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest("build/js"))
};

exports.scripts = scripts;

// Prepare a file with styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Optimize images

const images = () => {
  return gulp.src(["source/img/**/*{jpg,png,svg}", "!source/img/**/icon*.svg"])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
};

exports.images = images;

// Create WebP images

const webp = () => {
  return gulp.src("build/img/**/*{jpg,png}")
    .pipe(webP({ quality: 80 }))
    .pipe(gulp.dest("build/img"))
};

exports.webp = webp;

// Create sprite.svg

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            removeAttrs: { attrs: ["fill"] }
          }
        ]
      })
    ]))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
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
    "source/*.ico",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Copy html

const html = () => {
  return gulp.src(["source/**/*.html"],
    {
      base: "source"
    })
    .pipe(gulp.dest("build"));
};

exports.html = html;

// Clean folder build

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Watch for files

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", gulp.series(html, sync.reload));
  gulp.watch("source/js/**/*.js", gulp.series(scripts));
};

// Build a project

const build = gulp.series(
  clean,
  gulp.parallel(copy, html, styles, scripts),
  gulp.parallel(images, sprite),
  webp)

exports.build = build;

// Start developing

exports.default = gulp.series(
  build,
  gulp.parallel(server, watcher)
);
