Ext.define('WeiQuPai.controller.ShowUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showUser: 'showuser'
        },
        control: {
            showUser: {
                bgtap: 'showCameraLayer',
                followtap: 'doFollow',
                fanstap: 'doFans',
                avatartap: 'showAvatarCameraLayer',
                follow: 'doFollowMe'
            },

        }
    },

    doFollow: function(e) {
        var detailView = Ext.create('WeiQuPai.view.MyFollow');
        WeiQuPai.navigator.push(detailView);
    },
    doFans: function(e) {
        var detailView = Ext.create('WeiQuPai.view.MyFen');
        WeiQuPai.navigator.push(detailView);
    },

    //关注他
    doFollowMe: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var uid = this.getShowUser().getUid();
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/follow/follow&id=' + uid + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('你成功关注了TA');
        });
    },

    showAvatarCameraLayer: function(uid) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user || user.id != uid) return;
        //只有点自己的才能换封面
        var self = this;
        WeiQuPai.Util.showCameraLayer(100, 100, true, function(url) {
            self.setAvatar(url);
        });
    },

    showCameraLayer: function(uid) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user || user.id != uid) return;
        //只有点自己的才能换封面
        var self = this;
        WeiQuPai.Util.showCameraLayer(640, 400, true, function(url) {
            self.setCircleBg(url);
        });
    },

    //更换背影
    setCircleBg: function(url) {
        var record = this.getShowUser().down('#user-info').getRecord();
        record.set('circle_bg', url);
        WeiQuPai.Util.updateProfile({
            circle_bg: url
        });
    },
    //更换头像
    setAvatar: function(url) {
        var record = this.getShowUser().down('#user-info').getRecord();
        record.set('avatar', url);
        WeiQuPai.Util.updateProfile({
            avatar: url
        });
    }
});