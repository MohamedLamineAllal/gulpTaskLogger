var gulp = require('gulp'),
    watch = require('gulp-watch'),
    stripJsonComments = require('gulp-strip-json-comments'),
    source = require('vinyl-source-stream')


var TaskLogger = require('gulp-task-logger');

const path = require('path');


const tl = new TaskLogger();

// here a watch task
gulp.task('watch', function (done) {
    //json comments 
    var base = path.join(__dirname, './gulp-temp-json')
    watch('./gulp-temp-json/**/*.json', function (evt) {
        // console.log('hi there ');
        jsonCommentWatchEvt = evt
        jsonComment()
    })
    if (done) done();
});


var jsonCommentWatchEvt = null

//json comments

gulp.task('jsonComment', jsonComment);

function jsonComment(done) {
    if (!done) tl.task('jsonComment').startLog();
    jsonComment_Task(jsonCommentWatchEvt, done)
}

function jsonComment_Task(evt, done) {
    // var dest = path.join(__dirname, 'app/json/', getRelevantPath_usingBase(base, evt.path))
    gulp.src(evt.path, {
        base: './app/tempGulp/json/'
    }).
    pipe(stripJsonComments({
        whitespace: false
    })).on('error', console.log).
    on('data', function (file) { // here we want to manipulate the resulting stream

        var str = file.contents.toString()

        var stream = source(path.basename(file.path))
        stream.end(str.replace(/\n\s*\n/g, '\n\n'))
        stream.
        pipe(gulp.dest('./app/json/')).on('error', console.log)
        if (done) done();
        else tl.task('jsonComment').endLog();
    })
}
