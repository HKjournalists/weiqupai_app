Ext.define('WeiQuPai.controller.ShowUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showUser: 'showuser'   
        },
        control: {
            showUser: {
                bgtap: 'showCameraLayer',
                cardtap: 'doCardTap',
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
    },

    //卡片点击
    doCardTap: function(list, index, record, dataType){
        var cardHandler = this['card_' + dataType];
        cardHandler && cardHandler.call(this, record);
    },

    //进入商品详情
    card_item: function(record){
        //处理多次点击的问题
        var main = Ext.Viewport.down('main');
        if(main.isAnimating) return;
        var param = {id: record.get('json_data').id};
        var view = Ext.create('WeiQuPai.view.ItemDetail');
        view.setParam(param);
        main.push(view);
    }
});
