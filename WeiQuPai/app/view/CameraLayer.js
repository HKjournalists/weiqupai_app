Ext.define('WeiQuPai.view.CameraLayer', {
    extend: 'Ext.Container',
    requires: ['Ext.device.Camera'],
    xtype: 'cameralayer',
    config: {
        picWidth: 140,
        picHeight: 140,
        //缩放时是否等比裁剪
        crop: true,
        callback: null,
        cls: 'w-poplayer',
        items: [{
            xtype: 'button',
            action: 'camera',
            text: '拍照',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'album',
            text: '从手机相册选择',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'cancel',
            text: '取消',
            baseCls: 'w-popbutton w-popspacer',
        }]
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },

});