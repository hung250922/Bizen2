const moment = require("moment");
exports = module.exports = {};

exports.convertFromDate = (fromDate) => {
    let hours = new Date(fromDate).getUTCHours();
    let date = moment(new Date(fromDate)).subtract(hours, "hour").toDate(); 
    return date;
}

exports.convertToDate = (toDate) => {
    let hours = new Date(toDate).getUTCHours();
    let date = moment(new Date(toDate)).subtract(hours, "hour").add(24, "hour").toDate(); 
    return date;
}

exports.startOfDay = (date) => {
   const today = moment(date).startOf('day').toDate();
    return today;
}

exports.endOfDay = (date) => {
    const endDay = moment(date).endOf('day').toDate();
    return endDay;
}

exports.formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0
})