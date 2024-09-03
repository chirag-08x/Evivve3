cordova.define("com.apache.cordova.appexit.appExit", function(require, exports, module) { /*global cordova, module*/
module.exports = {
    dismissApp: function (message, win, fail) {
        cordova.exec(win, fail, "appExit", "", [message]);
    }
};
});
