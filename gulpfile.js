const dist = "dist"
const source = "src"


const path = {
    build: {
        html: dist + '/',
        css: dist + '/css/',
        js: dist + '/js/',
        img: dist + '/img/',
        fonts: dist + '/fonts/',
    },
    src: {
        html: [source + '/*.html', '!' + source + '/_*.html'],
        css: source + '/scss/style.scss',
        js: source + '/js/**/*.js',
        img: source + '/img/**/*.{png,jpg,svg,ico,gif,webp}',
        fonts: source + '/fonts/**/*.{ttf}',
    },
    watch: {
        html: source + '/**/*.html',
        css: source + '/scss/**/style.scss',
        js: source + '/js/**/*.js',
        img: source + '/img/**/*.{png,jpg,svg,ico,gif,webp}',
    },
    clean: './' + dist + '/'
}

const {src, dest} = require('gulp'),
      gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      fileinclude = require('gulp-file-include'),
      del = require('del'),
      scss = require('gulp-sass')(require('sass')),
      autoprefixer = require('gulp-autoprefixer')

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './' + dist + '/',
        },
        post: 3000,
        notify: false
    })      
}


function html() {
    return src(path.src.html)
                .pipe(fileinclude())
                .pipe(dest(path.build.html))
                .pipe(browsersync.stream())
}
function css() {
    return src(path.src.css)
                .pipe(scss({outputStyle: 'expanded'}))
                .pipe(autoprefixer({
                    overrideBrowserslist: ["last 5 versions"],
                    cascade: true
                }))
                .pipe(dest(path.build.css))
                .pipe(browsersync.stream())
}
function js() {
    return src(path.src.js)
                .pipe(fileinclude())
                .pipe(dest(path.build.js))
                .pipe(browsersync.stream())
}
function img() {
    return src(path.src.img)
                .pipe(dest(path.build.img))
                .pipe(browsersync.stream())
}
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
}
function clean() {
    return del(path.clean)
}

const build = gulp.series(clean, gulp.parallel(js,css,img,html))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.img = img
exports.js = js
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch