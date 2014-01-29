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
        layout: {
            type: 'card',
            animation: false
        },
        items: [{
                title: '今日',
                iconCls: 'home',
                xtype: 'today'
            },  {
                title: '已拍',
                iconCls: 'list',
                xtype: 'myauction'
            },  {
                title: '拍圈',
                iconCls: 'circle',
                xtype: 'circle'
            },  {
                title: '我的',
                iconCls: 'user',
                xtype: 'my'
            }      
        ]
    }
});
