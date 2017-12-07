/*
 * ccal
 * https://github.com/lyuehh/ccal
 *
 * Copyright (c) 2013 lyuehh
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var yaml = require('yaml');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');


function isWork(day, month, year, json) {
    var workDays = json.work;
    var freeDays = json.free;
    var date = new Date(year, month-1, day);
    var d = date.getFullYear() + ('00'+(date.getMonth()+1)).substr(-2) +
        ('00'+date.getDate()).substr(-2);

    if (_.include(freeDays, parseInt(d, 10))) { // 先检查休息日
        return false;
    } else {
        if (_.include(workDays, parseInt(d, 10))) { // 再检查工作日
            return true;
        } else {
            if (date.getDay() === 0 || date.getDay() === 6) {
                return false;
            } else {
                return true;
            }
        }
    }
}


function pad(day, month, year, json) {
    var str;
    if (day.toString().length === 1) {
        str = ' ' + day;
    } else {
        str = day;
    }
    if (day === '-') { // 空白日期跳过..
        return '  ';
    }
    var todayYear = new Date().getFullYear();
    var todayMonth = new Date().getMonth() + 1;
    var todayDay = new Date().getDate();

    // Show today as blue
    if (day === todayDay && month === todayMonth && year === todayYear) {
        return chalk.blue(str.toString());
    }
    if (isWork(day, month, year, json)) {
        return chalk.green(str.toString());
    } else {
        return chalk.red(str.toString());
    }
}

function processMonth(mon, json) {
    var year = parseInt(mon.substr(0,4), 10);
    var month = parseInt(mon.substr(4, 6), 10);
    var date = new Date(year, month-1);
    var dayEnd = new Date(year, month, 0).getDate(); // 本月共多少天
    var day = date.getDay(); // 本月1号是周几
    var padding = day - 1; // 天数前面的空白数
    if (padding === -1) { // 如果第1天是周末,则补上前面的6天
        padding = 6;
    }
    console.log('       ' + year + ('00'+month).substr(-2));
    console.log('一 二 三 四 五 六 日');
    var paddingArr = _.range(0, padding).map(function() {
        return '-';
    });
    var dayArr = _.range(1, dayEnd+1);
    var allDayArr = paddingArr.concat(dayArr);
    var tmpArr = [];
    var first = true;
    _.each(allDayArr, function(day, i) {
        if (i % 7 === 0) {
            if (!first) {
                console.log(tmpArr.join(' '));
            }
            first = false;
            tmpArr = [];
            tmpArr.push(pad(day, month, year, json));
        } else {
            tmpArr.push(pad(day, month, year, json));
        }
    });
    console.log(tmpArr.join(' '));
}

function processYear(year, json) {
    var days = _.range(1, 13);
    _.each(days, function(d) {
        processMonth(year+d, json);
        console.log('');
    });
}
exports.run = function(year) {
    var y = year.substr(0, 4);
    var file = path.resolve(__dirname, '../data/holiday.'+ y +'.yaml');
    var content = fs.readFileSync(file, 'utf8');
    var json = yaml.eval(content);

    if (year.length === 6) {
        processMonth(year, json);
    } else {
        processYear(year, json);
    }
};

