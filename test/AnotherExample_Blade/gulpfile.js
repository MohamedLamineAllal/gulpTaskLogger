var elixir = require('laravel-elixir');
require('laravel-browser-sync');

const gulp = require('gulp');
const TaskLogger = require('gulp-task-logger') //<===========
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const tl = new TaskLogger(); // <==============

elixir(function(mix) {
    mix.sass('app.scss');
    mix.browserify('app.js');
    mix.browserSync({
        'js': [
            'public/**/*.js',
        ],
        'css': [
            'public/**/*.css',
        ],
        'views': [
            'resources/views/**/*'
        ]
    }, {
        proxy: 'homestead.app',
        reloadDelay: 1000,
        reloadOnRestart: false,
        open: false
    });
});


let watcher;
function watchBlade(done) {
    watcher = gulp.watch(['resources/views/**/*']); 

    // watcher.on('add', function (pth) {
    watcher.on('change', function (state) { 
        if(state.type === 'added') {
            // we can make this task on it's own named function
            tl.task('blade-extension').startLog();//<========= task start
            parsed = path.parse(state.path);
            if(fs.lstatSync(state.path).isFile() && parsed.base.indexOf('.') === -1) {
                let newName = path.join(parsed.dir, parsed.base + '.blade.php');

                fs.renameSync(state.path, newName);
                tl.log('file: ' + state.path + '\nwas been renamed.');//<=======
                
                execSync(`code ${newName}`);
            } 
            tl.endLog();//<======================== task end
        }
    });
    done();
}

gulp.task('watchBlade', watchBlade);