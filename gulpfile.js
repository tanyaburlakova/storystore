const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const templateData = require('./app/data/data.json');
const mainBowerFiles = require('main-bower-files');
const svgstore = require('gulp-svgstore');
let bowerFiles = mainBowerFiles();

console.info(`
********** Bower Files **********
${bowerFiles}
`);

/******************************
 * Default task
 ******************************/
gulp.task('default', [
	'copyAssets',
	'browser-sync',
	'handlebars',
	'pluginsConcat',
	'jsConcat',
	'less',
	'watch'
]);

/******************************
 * Build task
 ******************************/
gulp.task('build', [
	'copyAssets',
	'handlebars',
	'pluginsConcatBuild',
	'jsConcatBuild',
	'lessBuild'
]);

/******************************
 * Copy assets to public
 ******************************/
gulp.task('copyAssets', () => {
	return gulp.src([
		'assets/**/*.*',
		'!assets/**/*.less'
	])
		.pipe(gulp.dest('public'));
});

/******************************
 * Handlebars
 ******************************/
gulp.task('handlebars', () => {
	templateData.timestamp = + new Date();
	return gulp.src('app/templates/*.handlebars')
		.pipe(handlebars(templateData, {
			ignorePartials: true, //ignores the unknown partials
			partials: {
				footer: '<footer>the end</footer>'
			},
			batch: ['./app/templates/partials'],
			helpers: {
				capitals: function (str) {
					return str.fn(this).toUpperCase();
				}
			}
		}))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest('./public'));
});

/******************************
 * JS plugins
 ******************************/
gulp.task('pluginsConcat', () => {
	return gulp.src(bowerFiles)
		.pipe(concat('plugins.min.js'))
		.pipe(gulp.dest('public/js'));
});

/******************************
 * JS plugins build
 ******************************/
gulp.task('pluginsConcatBuild', () => {
	return gulp.src(bowerFiles)
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

/******************************
 * JS concat
 ******************************/
gulp.task('jsConcat', () => {
	return gulp.src(['app/js/**/*.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.on('error', notify.onError(function (error) {
			return '\nAn error occurred while uglifying js.\nLook in the console for details.\n' + error;
		}))
		.pipe(sourcemaps.write('../js'))
		.pipe(gulp.dest('public/js'));
});

/******************************
 * JS concat build
 ******************************/
gulp.task('jsConcatBuild', () => {
	return gulp.src(['app/js/**/*.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.on('error', notify.onError(function (error) {
			return '\nAn error occurred while uglifying js.\nLook in the console for details.\n' + error;
		}))
		.pipe(sourcemaps.write('../js'))
		.pipe(gulp.dest('public/js'));
});

/******************************
 * Browser sync
 ******************************/
gulp.task('browser-sync', () => {
	let files = [
		'public/**/*.html',
		'public/js/**/*.js',
		'public/css/**/*.css'
	];

	browserSync.init(files, {
		server: {
			baseDir: './public'
		},
		open: false,
		ghostMode: false
	});
});

/******************************
 * Watch
 ******************************/
gulp.task('watch', () => {
	gulp.watch('app/less/*.less', ['less']);
	gulp.watch('app/js/**/*.js', ['jsConcat']);
	gulp.watch('app/templates/**/*.handlebars', ['handlebars']);
});

/******************************
 * Less
 ******************************/
gulp.task('less', () => {
	return gulp.src('app/less/app.less')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', notify.onError(function (error) {
			return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
		}))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('public/css'));
});

/******************************
 * Less build
 ******************************/
gulp.task('lessBuild', () => {
	return gulp.src('app/less/app.less')
		.pipe(plumber())
		.pipe(less())
		.on('error', notify.onError(function (error) {
			return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
		}))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({
			debug: true
		}, (details) => {
			let stats = details.stats;
			let input = stats.originalSize / 1000;
			let output = stats.minifiedSize / 1000;
			let efficiency = stats.efficiency * 100
			console.log(`
File name:  ${details.name}
Before:     ${input} kB
After:      ${output} kB
Time spent: ${stats.timeSpent} ms
Efficiency: ${efficiency}%
			`);
		}))
		.pipe(gulp.dest('public/css'));
});

/******************************
 * SVG stuff
 ******************************/
gulp.task('svgstore', function() {
    return gulp.src('assets/img/ico/*.svg')
        .pipe(svgstore())
        .pipe(gulp.dest('public/icons'));
});