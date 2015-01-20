Ext.define("WeiQuPai.User", {
    singleton: true,

    show: function(uid){
        var detailView = Ext.create('WeiQuPai.view.ShowUser', {
            uid: uid
        });
        WeiQuPai.navigator.push(detailView);
    },

    addFollow: function(uid, callback) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var url = WeiQuPai.Util.apiUrl('r=appv2/follow/follow');
        var data = {
            id: uid
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            WeiQuPai.app.fireEvent('addfollow', uid);
            Ext.isFunction(callback) && callback();
        });
    },

    cancelFollow: function(uid, callback) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var url = WeiQuPai.Util.apiUrl('r=appv2/follow/cancel');
        var data = {
            id: uid
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            WeiQuPai.app.fireEvent('cancelfollow', uid);
            Ext.isFunction(callback) && callback();
        });
    }
})