const { order, sort, merge } = require("./handlebars-scripts/make-open-hours");
const { translate } = require("./handlebars-scripts/translate");
const { currentStatus } = require("./handlebars-scripts/get-open-status");

// 
// This is the main entry point for the Handlebars scripts. The hbs compiler just needs to know where to find this file.
// 

module.exports = {
    currentStatus,
    merge,
    order,
    sort,
    translate,
};
