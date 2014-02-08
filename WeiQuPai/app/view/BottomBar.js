Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    requires: ['WeiQuPai.view.SubMenu'],
    config: {
        docked: 'bottom',
        layout: 'hbox',
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
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'center'
                },
                itemId: 'buttonContainer',
                flex: 1,

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
