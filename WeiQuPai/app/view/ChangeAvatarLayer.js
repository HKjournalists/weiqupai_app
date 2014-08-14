Ext.define('WeiQuPai.view.ChangeAvatarLayer', {
    extend: 'Ext.Container',
    xtype: 'changeavatarlayer',
    config: {
        cls: 'w-poplayer',
        items: [{
            xtype: 'button',
            action: 'changebg',
            text: '更换背景图片',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'changeavatar',
            text: '更换头像',
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
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('button[action=changebg]').on('tap', this.fireMyEvent, this);
        this.down('button[action=changeavatar]').on('tap', this.fireMyEvent, this);
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },

    fireMyEvent: function(btn) {
        this.fireEvent(btn.config.action);
        this.hide();
    }
});