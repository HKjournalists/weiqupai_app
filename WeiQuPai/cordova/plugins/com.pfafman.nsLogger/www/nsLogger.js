var exec = require('cordova/exec');

/**
 * Constructor
 */
function NSLogger() {
}

NSLogger.prototype.log = function (message) {
    cordova.exec(function(parm){}, function(error){}, "NSLogger", "log", [message]);
};

module.exports = new NSLogger();