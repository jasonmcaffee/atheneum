var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var glob = require("glob");
var through = require("through2");
var fs = require('fs');
var _ = require('underscore');
var uglify = require('gulp-uglify');
var gStreamify = require('gulp-streamify');//needed because gulp-uglify doesn't support streaming.
var less = require('gulp-less');
var path = require('path');

var reactify = require('reactify');
var minimatch = require('minimatch');

var buildConfig = require('./build-files/buildConfig').config;
var mixinCommonBrowserifyConfig = require('./build-files/buildConfig').mixinCommonBrowserifyConfig;
var commonBrowserifyConfig = require('./build-files/buildConfig').commonBrowserifyConfig;

/**
 * Build everything
 */
gulp.task('build', ['build:js', 'build:css']);


/**
 * Builds core.js to the dist dir.
 * core.js includes all modules defined in the js/core dir, as well as third party libs like jquery and react.
 *
 * https://github.com/substack/browserify-handbook
 *
 * TODO: jshint, remove console.log.
 */
function buildApp(){
    var idAlias={};
    //idAlias[__dirname + "/node_modules/react/react.js"] = "react";
    idAlias[__dirname + "/src/js/vendor/react-v0.12.2.min.js"] = "react";
    idAlias[__dirname + "/src/js/vendor/jquery.js"] = "jquery";

    /**
     * We want to expose our core modules so they can be referenced via 'core/modulename' instead of './js/core/modulename'
     * We also want to alias some of the third party libs, and expose them so they can be referenced via 'jquery', 'react', etc.
     */
    var labeler = through.obj(function (module, enc, next) {
        console.log('module id: ' + module.id);
        //expose id as 'react' rather than 'nodemodules/react/react.js'
        if(idAlias[module.id]){
            module.id = idAlias[module.id];
            //console.log('exposing new id: ' + module.id);
        }

        //iterate over each dependency of the module
        Object.keys(module.deps).forEach(function (key) {
            console.log('dep: %s key: %s', module.deps[key], key);
            //expose core by 'core/X' rather than './js/core/X'
           // if(key.indexOf('js/') >= 0) //only expose/tinker with core
                module.deps[key] = key;

            //if there's a dep on something we've aliased, point to the alias.
            //e.g. instead of 'react':'some/really/long/path/react.js' do 'react':'react'
            if(idAlias[module.deps[key]]){
                //console.log('pointing to alias for key:' + key);
                module.deps[key] = key;
            }
        });

        this.push(module);
        next();
    });


    /**
     * we want to include everything thats in the js folder, so gather all the filenames, and dont include extensions because it messes up module ids.
     */
    function getAppFilePaths(){
        var files =glob.sync("**/*.js*", { //./src/js/
            cwd: "./src/js"
            //cwd:"./src"
            //cwd: buildConfig.jsBaseDir //we don't want the returned paths to contain 'Users/jason.mcaffee/...' at the beginning, so start in the core dir.
        });
        files = _.filter(files, function(filePath){
           return filePath.indexOf('vendor/') < 0;
        });
        files.push("app");
        var withoutExtensions=[];
        files.forEach(function(file){
            withoutExtensions.push(file.replace('.jsx', '').replace('.js', ''));
        });

        console.log('app file paths:\n ' + JSON.stringify(withoutExtensions, null, 4));
        return withoutExtensions;
    }

    //mixin some of the common transforms, paths, etc.
    var browserifyConfig = mixinCommonBrowserifyConfig({
        entries:[].concat(getAppFilePaths())
    });
    console.log('build:app browserify config: %s', JSON.stringify(browserifyConfig, null, 2));

    var bundler = browserify(browserifyConfig);
    bundler.pipeline.get('label').splice(0, 1, labeler);//rename module ids

    //require any third party libraries.
    bundler.require('./src/js/vendor/jquery.js', {expose:'jquery'}); //expose is how the modules require it. e.g. require('jquery');
    bundler.require('./src/js/vendor/react-v0.12.2.min.js', {expose:'react'});

    return bundler
        .bundle()
        .pipe(source('bundle.js'))//the generated file name
        .pipe(gStreamify(uglify(buildConfig.uglify)))
        .pipe(gulp.dest(buildConfig.jsDistDir));//where to put the generated file name
}
gulp.task("build:js", buildApp);



gulp.task('build:css', function () {
    gulp.src(buildConfig.lessBaseDir + '/Home.less')//'./less/**/*.less'
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ],
            compress: true
        }))
        .pipe(gulp.dest(buildConfig.lessDistDir));
});


/**
 * Watch tasks so you don't have to manually build each time you change a file
 */
gulp.task('watch:js', function(){
    gulp.watch(buildConfig.jsBaseDir + '/**/*.js*', ['build:core-and-ui-components-app']);
});
gulp.task('watch:less', function(){
    gulp.watch(buildConfig.lessBaseDir + '/**/*.less', ['build:core-css', 'build:pattern-library-css']);
});

//gulp.task("jshint", function(){
//    return gulp.src([buildConfig.jsBaseDir + '/**/*.js*'])
//        .pipe(jshint(buildConfig.jshint))
//        .pipe(jshint.reporter(stylish));
//});