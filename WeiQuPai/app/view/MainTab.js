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
        items: [
            {
                title: '今日',
                iconCls: 'tab-today',
                xtype: 'today',
                flex: 1
            },
            {
                title: '已拍',
                iconCls: 'tab-myauction',
                xtype: 'myauction',
                flex: 1
            },
            {
                title: '拍圈',
                iconCls: 'tab-circle',
                xtype: 'circle',
                flex: 1
            },
            {
                title: '我的',
                iconCls: 'tab-my',
                xtype: 'my',
                flex: 1
            }      
        ]
    },

    initialize: function(){
        this.callParent(arguments);
        this.on('hide', this.onHide, this);
        this.down('tabbar').getAt(0).element.on('doubletap', this.onDoubleTap, this);
        this.down('tabbar').getAt(1).element.on('doubletap', this.onDoubleTap, this);
        this.down('tabbar').getAt(2).element.on('doubletap', this.onDoubleTap, this);
    },

    setBadge: function(tab){
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge w-badge-sdot');
        tab.element.addCls('x-hasbadge');
        tab.badgeElement.show();
    },

    setBadgeText: function(tab, text){
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge');
        tab.setBadgeText(text);
    },

    clearBadge: function(tab){
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge');
        tab.element.removeCls('x-hasbadge');
        tab.badgeElement.hide();
    },

    onDoubleTap: function(){
        this.getActiveItem().getScrollable().getScroller().scrollToTop(true);
    },

    onHide: function(){
        this.down('today banner').stopTimer();
        this.down('circle banner').stopTimer();
    }
});
