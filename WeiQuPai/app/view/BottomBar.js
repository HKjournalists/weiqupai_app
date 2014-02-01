Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    requires: ['WeiQuPai.view.SubMenu'],
    config: {
        docked: 'bottom',
        cls: 'w-toolbar',
        items: [
            {
                xtype: 'button',
                text: '返回',
                iconAlign: 'top',
                cls: 'w-tab-button',
                iconCls: 'tab-back',
                action: 'back'

            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                text: '微趣拍',
                iconAlign: 'top',
                cls: 'w-tab-button',
                iconCls: 'tab-menu',
                action: 'menu'
            }
        ]
    }
});
