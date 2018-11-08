var date = require('date-and-time');
var colors = require('colors');
var prettyMs = require('pretty-ms');

function getStringFromFormat(format, elementsReplac) {
    var re = new RegExp(Object.keys(elementsReplac).join("|"), "gi");
    return format.replace(re, function (matched) {
        return colors[colorMap.call(this, matched)](elementsReplac[matched]);
    }.bind(this));
}

function colorMap(el) {
    // console.dir(this);
    if (this.colors.hasOwnProperty(el)) {
        return this.colors[el];
    }
    return 'white';
}

var TaskLogger = function (options) {
    this.init = function (options) {
        var defaultOptions = {
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

        this.tasks = {};

        if (options && options.colors) options.colors = Object.assign({}, defaultOptions.colors, options.colors);
        Object.assign(this, defaultOptions, options);
    }


    this.task = function (taskName) {
        this.taskName = taskName;
        return this;
    }

    this.log = function (msg) {
        this.tasks[this.taskName].end = new Date();
        console.log(getStringFromFormat.call(this, this.logFormat, {
            taskName: this.taskName,
            time: this.timeString(),
            startMessage: this.startMessage,
            endMessage: this.endMessage,
            prefix: this.prefix,
            msg,
            duration: this.endGetDuration()
        }));
    }

    this.timeString = function () {
        return date.format(new Date(), 'hh:mm:ss');
    }

    this.startLog = function (msg) {
        this.tasks[this.taskName] = {
            start: new Date()
        }
        console.log(getStringFromFormat.call(this, this.startMsgFormat, {
            taskName: this.taskName,
            time: this.timeString(),
            startMessage: this.startMessage,
            endMessage: this.endMessage,
            prefix: this.prefix,
            msg
        }));
    }
    this.endLog = function (msg) {
        this.tasks[this.taskName].end = new Date()
        console.log(getStringFromFormat.call(this, this.endMsgFormat, {
            taskName: this.taskName,
            time: this.timeString(),
            startMessage: this.startMessage,
            endMessage: this.endMessage,
            prefix: this.prefix,
            msg,
            duration: this.endGetDuration()
        }));
    }

    this.endGetDuration = function () {
        if(this.tasks[this.taskName].start) {
            return prettyMs(this.tasks[this.taskName].end - this.tasks[this.taskName].start);
        }
    }

    this.init(options);
}

module.exports = TaskLogger;

