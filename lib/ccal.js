/*
 * ccal
 * https://github.com/lyuehh/ccal
 *
 * Copyright (c) 2013 lyuehh
 * Licensed under the MIT license.
 */

'use strict';
require('colors');
var yaml = require('yaml');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.red) // outputs red underlined text
// console.log('OMG Rainbows!'.rainbow); // rainbow (ignores spaces)


function isWork(day, month, year, json) {
    var workDays = json.work;
    var freeDays = json.free;
    var date = new Date(year, month-1, day);
    // console.log(date);
    var d = date.getFullYear() + ('00'+(date.getMonth()+1)).substr(-2) +
        ('00'+date.getDate()).substr(-2);
    // var d = date.toISOString().split('T')[0].replace(/-/g, '');
    // var d = date.toISOString();
    // console.log(date);
    // console.log('1:');
    // console.log(d);
    // console.log(typeof freeDays[0]);
    // console.log(typeof d);

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
        // str = day;
    } else {
        str = day;
    }

    // console.log(1);
    // console.log(day);
    // console.log(month);
    // console.log(year);
    // console.log(json);

    if (day === '-') { // 空白日期跳过..
        return '  ';
    }
    if (isWork(day, month, year, json)) {
        return str.toString().green;
    } else {
        return str.toString().red;
    }
    // TODO 在这里判断是工作还是休息, 然后加上颜色
    // return str.toString();
    // return str.toString().red;
}

function processMonth(mon, json) {
    // console.log(mon.green);
    var year = parseInt(mon.substr(0,4));
    var month = parseInt(mon.substr(4, 6));
    var date = new Date(year, month-1);
    var dayEnd = new Date(year, month, 0).getDate(); // 本月共多少天
    var day = date.getDay(); // 本月1号是周几
    // console.log(day);
    var padding = day - 1; // 天数前面的空白数
    // console.log(padding);
    if (padding === -1) { // 如果第1天使周末,则补上前面的6天
        padding = 6;
    }
    var paddingArr = _.range(0, padding).map(function() {
        return '-';
    });
    var dayArr = _.range(1, dayEnd+1);
    var allDayArr = paddingArr.concat(dayArr);
    // console.log(allDayArr);
    var tmpArr = [];
    var first = true;
    _.each(allDayArr, function(day, i) {
        // console.log(day);
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

    // console.log(date);
    // console.log(day);
    // console.log(dayEnd);
    // console.log(padding);
}

function processYear() {

}
exports.run = function(year) {
    var y = year.substr(0, 4);
    var file = path.resolve(__dirname, '../data/holiday.'+ y +'.yaml');
    var content = fs.readFileSync(file, 'utf8');
    var json = yaml.eval(content);
    console.log('       ' + year);
    console.log('一 二 三 四 五 六 日');
    // console.log('');

    if (year.length === 6) {
        processMonth(year, json);
    } else {
        processYear(year, json);
    }
    // console.log('Work:');
    // console.log(isWork(1, 1, 2014, json));
    // console.log(isWork(1, 12, 2013, json));
    // console.log(json);
};

