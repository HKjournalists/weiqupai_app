Ext.define('WeiQuPai.view.DeleteButtonLayer', {
    extend: 'Ext.Container',
    xtype: 'deletebuttonlayer',
    config: {
        deleteAction: null,
        scope: null,
        cls: 'w-poplayer',
        items: [{
            xtype: 'button',
            action: 'delete',
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
        this.down('button[action=delete]').on('tap', function() {
            this.hide();
            this.getDeleteAction().call(this.getScope() || this);
        }, this);
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },
});