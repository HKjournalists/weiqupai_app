Ext.define('WeiQuPai.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    requires: [
        'Ext.tab.Panel',
        'WeiQuPai.view.Today',
        'WeiQuPai.view.Auction',
        'WeiQuPai.view.My',
        'WeiQuPai.view.Setting'
    ],
    config: {
        useTitleForBackButtonText: true,
        items: [
            {
                title: '今日',
                xtype: 'tabpanel',
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
                        title: '在拍',
                        iconCls: 'list',
                        xtype: 'auction'
                    },  {
                        title: '我的',
                        iconCls: 'user',
                        xtype: 'my'
                    },  {
                        title: '设置',
                        iconCls: 'settings',
                        xtype: 'setting'
                    }          
                ]

            }
        ]
    }
});
