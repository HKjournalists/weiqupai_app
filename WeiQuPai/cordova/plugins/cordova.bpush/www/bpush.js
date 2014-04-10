var exec = require('cordova/exec');

module.exports = {
    /**
     * bind channel for current device
     *
     * @param successCallback(res)
     *   res object
     *      deviceToken: the device token
     *      appId:  the app id
     *      userId:  the user id 
     *      channelId: the channel id
     *
     * @example
     * <code>
     * BPush.bindChannel(function(res){
     *  console.log(res);
     * }, function(errMsg){
     *  alert(errMsg);
     * });
     * </code>
     *
     */
    bindChannel: function(onSuccess, onError){
        exec(onSuccess, onError, "BPush", "bindChannel", []);
    },

    /**
     * unbind channel for current device
     *
     * @example
     * <code>
     * BPush.unbindChannel(, function(){
     *   alert('unbind success!');
     * }, function(errMsg){
     *   alert(errMsg);
     * });
     * </code>
     *
     */
    unbindChannel: function(onSuccess, onError){
        exec(onSuccess, onError, "BPush", "unbindChannel", []);
    },

};
