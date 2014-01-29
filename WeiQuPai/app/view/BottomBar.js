Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    config: {
        docked: 'bottom',
        cls: 'w-toolbar',
        items: [
            {
                xtype: 'button',
                cls: 'x-button-back',
                action: 'back'

            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                text: '微趣拍',
                iconCls: 'home'
            }
        ]
    }
});
