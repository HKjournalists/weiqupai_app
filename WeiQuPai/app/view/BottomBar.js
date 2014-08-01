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
            cls: 'btm1',
            action: 'share'
        }, {
            cls: 'btm2',
            action: 'pai'
        }, {
            cls: 'btm3',
            action: 'comment'
        }]
    }

});