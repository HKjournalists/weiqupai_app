Ext.define('WeiQuPai.view.SubMenu', {
    extend: 'Ext.Container',
    xtype: 'submenu',
    config: {
        hidden: true,
        cls: 'submenu',
        modal: {xtype: 'mask', transparent: true},
        hideOnMaskTap: true,
        /*
        showAnimation: {
            type: 'pop'
        },
        hideAnimation: {
            type: 'popOut'
        },
        */
        items: [
            {
                xtype: 'button',
                cls: 'menu-button today',
                text: '今日',
                action: 'today'
            },
            {
                xtype: 'button',
                cls: 'menu-button myauction',
                text: '已拍',
                action: 'myauction'
            },
            {
                xtype: 'button',
                cls: 'menu-button circle',
                text: '拍圈',
                action: 'circle'
            },
            {
                xtype: 'button',
                cls: 'menu-button my',
                text: '我的',
                action: 'my'
            }
        ]
    }
});
