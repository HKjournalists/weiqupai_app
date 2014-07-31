Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    config: {
        docked: 'bottom',
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        cls: 'bottombar',
        items: [{
            iconCls: 'btm1',
            action: 'share'
        }, {
            iconCls: 'btm2',
            action: 'pai'
        }, {
            iconCls: 'btm3',
            action: 'comment'
        }]
    }
});