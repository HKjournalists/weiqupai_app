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
                cancelfollow: 'doCancelFollow',
                pm: 'doPm',
            },

        }
    },

    doFollow: function(view) {
        var detailView = Ext.create('WeiQuPai.view.HisFollow');
        detailView.setUid(view.getUid());
        WeiQuPai.navigator.push(detailView);
    },

    doFans: function(view) {
        var detailView = Ext.create('WeiQuPai.view.HisFans');
        detailView.setUid(view.getUid());
        WeiQuPai.navigator.push(detailView);
    },

    doPm: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var data = view.getData();
        var view = Ext.create('WeiQuPai.view.PrivateMessage');
        view.setUid(data.id);
        view.down('vtitlebar').setTitle(data.nick);
        WeiQuPai.navigator.push(view);
    },

    //关注他
    doFollowMe: function(view) {
        WeiQuPai.User.addFollow(view.getUid(), function(){
            WeiQuPai.Util.toast('你成功关注了TA');
            view.getData().followed = true;
            view.setData(view.getData());
        });
    },

    doCancelFollow: function(view){
        WeiQuPai.User.cancelFollow(view.getUid(), function(){
            view.getData().followed = false;
            view.setData(view.getData());
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
        WeiQuPai.Util.showCameraLayer(140, 140, true, function(url) {
            self.setAvatar(url);
            WeiQuPai.app.statReport({
                act: 'setavatar'
            });
        });
    },

    showCameraLayer: function() {
        var self = this;
        WeiQuPai.Util.showCameraLayer(640, 400, true, function(url) {
            self.setCircleBg(url);
            WeiQuPai.app.statReport({
                act: 'setbg'
            });
        });
    },

    //更换背影
    setCircleBg: function(url) {
        var view = WeiQuPai.navigator.getActiveItem();
        var data = view.down('#personmodel').getData();
        data.circle_bg = url;
        view.down('#personmodel').setData(data);
        WeiQuPai.Util.updateProfile({
            circle_bg: url
        });
    },

    //更换头像
    setAvatar: function(url) {
        var view = WeiQuPai.navigator.getActiveItem();
        var data = view.down('#personmodel').getData();
        data.avatar = url;
        view.down('#personmodel').setData(data);
        WeiQuPai.Util.updateProfile({
            avatar: url
        });
    }
});