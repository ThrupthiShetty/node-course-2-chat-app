var moment = require("moment");
//var date = new Date();

// var date = moment();
// date.add(1,'year').subtract(9,'months')
// console.log(date.format('MMM Do YYYY'))

//new Date().getTime() is same as
var someTimestamp = moment().valueOf()
console.log(someTimestamp)

var createdat = 1234
var date = moment(createdat);
console.log(date.format('h:mm a'))