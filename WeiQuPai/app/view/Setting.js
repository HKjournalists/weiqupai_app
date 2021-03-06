Ext.define('WeiQuPai.view.Setting', {
    extend: 'Ext.Container',
    xtype: 'setting',
    requires: ['WeiQuPai.view.About', 'WeiQuPai.view.ReturnAnnounce', 'WeiQuPai.view.AppUpdate'],
    config: {
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '设置',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'disclosureitem',
            title: '退货说明',
            itemId: 'return'
        }, {
            xtype: 'disclosureitem',
            title: '意见反馈',
            itemId: 'feedback'
        }, {
            xtype: 'disclosureitem',
            title: '关于微趣拍',
            itemId: 'about',
        }, {
            xtype: 'disclosureitem',
            title: '检查更新',
            itemId: 'update'
        }, {
            xtype: 'button',
            text: '退出登录',
            baseCls: 'w-button',
            action: 'logout',
            hidden: true
        }]
    },

    initialize: function() {
        this.on('activate', this.onActivate, this);
    },

    onActivate: function() {
        this.down('button[action=logout]').setHidden(!WeiQuPai.Util.isLogin());
        if (WeiQuPai.Notify.hasNotify(WeiQuPai.Notify.MSG_APP_UPDATE)) {
            this.down('disclosureitem[itemId=update]').setBadge();
        }
    }
});