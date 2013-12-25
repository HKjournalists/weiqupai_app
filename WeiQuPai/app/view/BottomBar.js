Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    config: {
        docked: 'bottom',
        items: [
            {
                xtype: 'button',
                text: '返回',
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
