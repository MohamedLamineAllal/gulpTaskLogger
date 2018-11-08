# gulp TaskLogger

A helper for gulp, to log at task start, end, and any other log, with time, and string formatting, and collor personalisation, and more .., Can be used as a cli program loggin helper too out of gulp.

![gulp-task-logger in action]( https://raw.githubusercontent.com/MohamedLamineAllal/gulpTaskLogger/master/images/gulp_TaskLogger.png  "gulp-task-logger in action")


##Notice:
Gulp version 4 have no gulp.start(), logging the start and end of our tasks can be just important, gulp-task-logger is a nice helper that make it a breeze.

## install:
```
npm i gulp-task-logger --save
```

## use example:
Here an example (you find it, in git repo)
```javascript
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    stripJsonComments = require('gulp-strip-json-comments'),
    source = require('vinyl-source-stream')


var TaskLogger = require('gulp-task-logger'); // <===== require

const path = require('path');


const tl = new TaskLogger(); // <==== initiation without options (default)

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
    if (!done) tl.task('jsonComment').startLog(); //<======= log at task start [notice if(!done)! it's to make sure we are only logging ourselves, when we are calling the function ourselves without done! if it's the normal from cli task execution, then the log will happen by gulp]
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
        if (done) done(); // same if done not undefined => then it's task cli execution
        else tl.task('jsonComment').endLog(); //<=============== otherwise we log ourselves
    })
}

```


## require
```javascript
var TaskLogger = require('gulp-task-logger');
```

## create an instance
Default options:
```javascript
const tl = new TaskLogger();
```

With options:
```javascript
const tl = new TaskLogger({
    // options go here
});
```

## List of options properties

```javascript
{
    taskName: '',
    prefix: '',
    colors: {
        taskName: 'cyan',
        time: 'gray',
        startMessage: 'yellow',
        endMessage: 'yellow',
        msg: 'white',
        prefix: 'red',
        duration: 'magenta'
    },
    startMessage: 'Starting',
    endMessage: 'Finished',
    startMsgFormat: '[time] startMessage \'taskName\'...',
    endMsgFormat: '[time] endMessage \'taskName\' after duration',
    logFormat: '[time] msg' //'[time] prefix msg'
}
```
### Explanation:

three sections:

### Formatting: 

```javascript
{
    startMsgFormat: '[time] startMessage \'taskName\'...',
    endMsgFormat: '[time] endMessage \'taskName\' after duration',
    logFormat: '[time] msg' //'[time] prefix msg'
}
```
Using the same properties some there values come from options, each one of the properties will be replaced with it's corresponding value, all properties have a default value, even if you don't precise it (defaulting to '').

### There is 7 properties:

|  Properties   |
| ------------- |
|  taskName     | 
|  time         |
|  startMessage |
|  endMessage   |
|  msg          |
|  prefix       |
|  duration     |


prcise using this keyword your formatting, then set there value in options too, except duration, and time, and msg. The two first automatically calculated, and msg you provide, when calling one of the three logging functions.

## logging
3 functions for know
```javascript
log() // by default log a message + time at start
endLog() // By default show end task message equivalent to the default one of gulp
startLog() // same but for start
```
With options you can change the formatting as the value of each part of the properties.

## task()

```javascript
tl.task('myTaskName') // this set which task you want to log about
```
If the code is synchronous, you can set it once and call the logging functions as you like.

Otherwise if you are not sure you must use:
```javascript
tl.task('myTaskName').log('myMessage'); // log right away and each time 
```
note *task()* return the instance itself, you can use any of the available methods.

## colors
gulp-task-logger deppend on '[colors](https://www.npmjs.com/package/colors)'
So you can use any of the colors it provide.


Here you can find a test example:
https://github.com/MohamedLamineAllal/gulpTaskLogger/tree/master/test

Here another example:
https://github.com/MohamedLamineAllal/gulpTaskLogger/tree/master/test/AnotherExample_Blade

```javascript
const gulp = require('gulp');
const TaskLogger = require('gulp-task-logger') // <=======
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');


const tl = new TaskLogger();//<---------------


let watcher;
function watchBlade(done) {
    watcher = gulp.watch(['resources/views/**/*']); 

    // watcher.on('add', function (pth) {
    watcher.on('change', function (state) { 
        if(state.type === 'added') {
            // we can make this task on it's own named function
            tl.task('blade-extension').startLog();//<========= task start
            parsed = path.parse(state.path);
            if(parsed.base.indexOf('.') === -1) {
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
```
![gulp logger in action 2](https://raw.githubusercontent.com/MohamedLamineAllal/gulpTaskLogger/master/images/gulpeBlade_and_gulp-task-logger.png "gulpBlade and gulp-task-logger")

////// documentation to be continued! 

// more features are to be expected!

// feedback appreciated!




//Notice:
Bug was fixed!
duration is not defined !!
If you encounter that, update your package.