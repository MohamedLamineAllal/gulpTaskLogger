var elixir = require('laravel-elixir');
require('laravel-browser-sync');

const gulp = require('gulp');
const TaskLogger = require('gulp-task-logger') //<===========
const fs = require('fs');
const path = require('path');

const tl = new TaskLogger();

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
    watcher.on('change', function (state) { // we can make this task on it's own named function
        if(state.type === 'added') {
            tl.task('blade-extension').startLog();//<=========
            parsed = path.parse(state.path);
            if(parsed.base.indexOf('.') === -1) {
                fs.renameSync(state.path, path.join(parsed.dir, parsed.base + '.blade.php'));
                tl.log('file: ' + state.path + '\nwas been created.');//<=======
                
                tl.endLog();//<========================
            } 
        }

    });
    done();
}

gulp.task('watchBlade', watchBlade);