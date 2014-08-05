Ext.define('WeiQuPai.view.ConsigneePopLayer', {
    extend: 'Ext.Container',
    xtype: 'consigneepoplayer',
    config: {
        cls: 'w-poplayer',
        items: [{
            xtype: 'button',
            action: 'select',
            text: '使用',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'setDefault',
            text: '设为默认',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'edit',
            text: '编辑',
            baseCls: 'w-popbutton',
        }, {
            xtype: 'button',
            action: 'del',
            text: '删除',
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
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },

});