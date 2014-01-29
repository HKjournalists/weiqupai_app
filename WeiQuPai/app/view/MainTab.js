Ext.define('WeiQuPai.view.MainTab', {
    extend: 'Ext.tab.Panel',
    xtype: 'maintab',
    requires: [
        'Ext.tab.Panel',
        'WeiQuPai.view.Today',
        'WeiQuPai.view.MyAuction',
        'WeiQuPai.view.Circle',
        'WeiQuPai.view.My'
    ],
    config: {
        tabBarPosition: 'bottom',
        cls: 'w-main-tab',
        layout: {
            type: 'card',
            animation: false
        },
        items: [{
                title: '今日',
                iconCls: 'tab-today',
                xtype: 'today'
            },  {
                title: '已拍',
                iconCls: 'tab-myauction',
                xtype: 'myauction'
            },  {
                title: '拍圈',
                iconCls: 'tab-circle',
                xtype: 'circle'
            },  {
                title: '我的',
                iconCls: 'tab-my',
                xtype: 'my'
            }      
        ]
    }
});
