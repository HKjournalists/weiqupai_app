Ext.define('WeiQuPai.controller.ShowUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showUser: 'showuser'
        },
        control: {
            showUser: {
                bgtap: 'showChangeLayer',
                followtap: 'doFollow',
                fanstap: 'doFans',
                follow: 'doFollowMe',
                pm: 'doPm',
            },

        }
    },

    doFollow: function(view) {
        var detailView = Ext.create('WeiQuPai.view.MyFollow');
        detailView.setUid(view.getUid());
        WeiQuPai.navigator.push(detailView);
    },

    doFans: function(view) {
        var detailView = Ext.create('WeiQuPai.view.MyFen');
        detailView.setUid(view.getUid());
        WeiQuPai.navigator.push(detailView);
    },

    doPm: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
    },

    //关注他
    doFollowMe: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var uid = view.getUid();
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/follow/follow&id=' + uid + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('你成功关注了TA');
        });
    },

    showChangeLayer: function(view) {
        //只有点自己的才能换封面
        var uid = view.getUid();
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user || user.id != uid) return;
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ChangeAvatarLayer');
        layer.on('changebg', this.showCameraLayer, this);
        layer.on('changeavatar', this.showAvatarCameraLayer, this);
        layer.show();
    },

    showAvatarCameraLayer: function() {
        var self = this;
        WeiQuPai.Util.showCameraLayer(100, 100, true, function(url) {
            self.setAvatar(url);
        });
    },

    showCameraLayer: function() {
        var self = this;
        WeiQuPai.Util.showCameraLayer(640, 400, true, function(url) {
            self.setCircleBg(url);
        });
    },

    //更换背影
    setCircleBg: function(url) {
        var view = WeiQuPai.navigator.getActiveItem();
        var data = view.down('#personmodel').getData();
        data.circle_bg = url;
        WeiQuPai.Util.updateProfile({
            circle_bg: url
        });
    },

    //更换头像
    setAvatar: function(url) {
        var view = WeiQuPai.navigator.getActiveItem();
        var data = view.down('#personmodel').getData();
        data.avatar = url;
        WeiQuPai.Util.updateProfile({
            avatar: url
        });
    }
});