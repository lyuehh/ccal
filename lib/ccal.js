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

exports.run = function(year) {
    var y = year.substr(0, 4);
    var file = path.resolve(__dirname, '../data/holiday.'+ y +'.yaml');
    var content = fs.readFileSync(file, 'utf8');
    var json = yaml.eval(content);
    console.log('   ' + year);
    console.log('一 二 三 四 五 六 日');
    // console.log('');

    if (year.length === 6) {
        processMonth(year);
    } else {
        processYear(year);
    }
    // console.log(json);
};

function isWork(date, json) {

}

function isFree(date, json) {

}

function pad(day) {
    var str;
    if (day.toString().length === 1) {
        str = ' ' + day;
        // str = day;
    } else {
        str = day;
    }
    return str;
}

function processMonth(mon) {
    // console.log(mon.green);
    var year = parseInt(mon.substr(0,4));
    var month = parseInt(mon.substr(4, 6));
    // console.log(year);
    // console.log(month);
    var date = new Date(year, month-1);
    var dayEnd = new Date(year, month, 0).getDate(); // 本月共多少天
    var day = date.getDay(); // 本月1号是周几
    var padding = day - 1; // 天数前面的空白数
    // console.log(padding);
    var paddingArr = _.range(0, padding).map(function() {
        return '-';
    });
    // console.log(paddingArr);
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
            tmpArr.push(pad(day));
        } else {
            tmpArr.push(pad(day));
        }
    });
    console.log(tmpArr.join(' '));

    // console.log(date);
    // console.log(day);
    // console.log(dayEnd);
    // console.log(padding);
}

function processYear(year) {

}
