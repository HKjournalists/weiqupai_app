Ext.define('WeiQuPai.controller.ShowUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showUser: 'showuser'   
        },
        control: {
            showUser: {
                bgtap: 'showCameraLayer'
            }
        }
    },


    showCameraLayer: function(uid){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user || user.id != uid) return;
        //只有点自己的才能换封面
        var self = this;
        WeiQuPai.Util.showCameraLayer(640, 400, function(url){
            self.setCircleBg(url);
        });
    },

    //更换背影
    setCircleBg: function(url){
        var record = this.getShowUser().down('#user-info').getRecord();
        record.set('circle_bg', url);
        WeiQuPai.Util.updateProfile({circle_bg: url});
    }
});
