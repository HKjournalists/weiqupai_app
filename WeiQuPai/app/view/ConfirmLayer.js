Ext.define('WeiQuPai.view.ConfirmLayer', {
    extend: 'Ext.Container',
    xtype: 'deletebuttonlayer',
    config: {
        confirmAction: null,
        scope: null,
        cls: 'w-poplayer',
        items: [{
            xtype: 'button',
            action: 'confirm',
            text: '确定',
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
        this.down('button[action=confirm]').on('tap', function() {
            this.hide();
            this.getConfirmAction().call(this.getScope() || this);
        }, this);
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },
});