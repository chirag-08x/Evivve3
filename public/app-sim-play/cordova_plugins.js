cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
   /* {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },*/
    {
        "file": "plugins/cordova-plugin-spinnerdialog/www/spinner.js",
        "id": "cordova-plugin-spinnerdialog.SpinnerDialog",
        "pluginId": "cordova-plugin-spinnerdialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "id": "cordova-plugin-x-toast.Toast",
        "pluginId": "cordova-plugin-x-toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/test/tests.js",
        "id": "cordova-plugin-x-toast.tests",
        "pluginId": "cordova-plugin-x-toast"
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "id": "cordova-plugin-dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/com.apache.cordova.appexit/www/appExit.js",
        "id": "com.apache.cordova.appexit.appExit",
        "clobbers": [
            "navigator.appexit"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.playvr/www/playvr.js",
        "id": "org.apache.cordova.playvr.playvr",
        "clobbers": [
            "navigator.playvr"
        ]
    },
    {
        "file": "plugins/com.apache.cordova.appexit/www/appExit.js",
        "id": "com.apache.cordova.appexit.appExit",
        "clobbers": [
            "navigator.appexit"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{

    "cordova-plugin-spinnerdialog": "1.3.2",
    "cordova-plugin-x-toast": "2.4.0",
    "cordova-plugin-splashscreen": "2.1.0"
}
// BOTTOM OF METADATA
});