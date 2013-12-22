#!/usr/bin/env node
var _ = require('underscore');
var run = require('../lib/ccal.js').run;
var support = ['2013', '2014'];

var arg = process.argv[2];

if (arg && (arg.length === 4 || arg.length === 6)) {
    if (_.include(support, arg.toString().substr(0, 4))) {
        run(arg);
    } else {
        console.log('now only support 2013, 2014');
    }
} else if(arg === '-h'){
  console.log('');
  console.log('Usage: ccal [year | year_and_month]');
  console.log('');
  console.log('Example: ccal 2014, ccal 20140101 etc');
  console.log('now only support 2013, 2014');
  console.log('');
} else {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var arg = year + ('00'+month).substr(-2);
    run(arg);
}
