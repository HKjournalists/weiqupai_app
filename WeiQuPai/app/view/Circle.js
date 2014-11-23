Ext.define('WeiQuPai.view.Circle', {
    extend: 'Ext.Container',
    requires: [
        'WeiQuPai.view.CircleFollow', 'WeiQuPai.view.CircleKillEnd', 'WeiQuPai.view.CircleSquare',
        'WeiQuPai.view.SelectUser', 'WeiQuPai.view.CircleAd'
    ],
    xtype: 'circle',
    config: {
        cls: 'newPai',
        scrollable: 'vertical',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            refreshFn: 'fetchLastest',
            scrollerAutoRefresh: true
        }],
        items: [{
            xtype: 'vtitlebar',
            title: '拍圈',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'container',
            docked: 'top',
            layout: 'hbox',
            cls: 'newPai_btn',
            style: 'position:relative;z-index:100',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                cls: 'x-button-active',
                text: '关注',
                action: 'tab_circlefollow',
                itemId: 'tab_circlefollow'
            }, {
                flex: 1,
                xtype: 'button',
                text: '血战',
                action: 'tab_circlekillend',
                itemId: 'tab_circlekillend'
            }, {
                flex: 1,
                xtype: 'button',
                text: '广场',
                action: 'tab_circlesquare',
                itemId: 'tab_circlesquare'
            }]
        }, {
            xtype: 'circlead'
        }, {
            xtype: 'circlefollow'
        }, {
            xtype: 'circlekillend',
            hidden: true
        }, {
            xtype: 'circlesquare',
            hidden: true
        }],
        activeTab: null,
    },
    tabPosition: 0,

    initialize: function() {
        this.initTab();
        this.on('activate', this.onActivate, this);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);
    },

    onActivate: function() {
        this.down('circlead').loadData();
        var msgType = [WeiQuPai.Notify.MSG_CIRCLE, WeiQuPai.Notify.MSG_CIRCLE_REPLY, WeiQuPai.Notify.MSG_CIRCLE_ZAN];
        //刷新当前active的tab
        this.getActiveTab().tabView.loadData();
        if (WeiQuPai.Notify.hasNotify(msgType)) {
            WeiQuPai.Notify.clearNotify(msgType);
        }
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        var list = this.getList();
        list.getActiveTab().tabView.loadData(function() {
            setTimeout(function() {
                me.setState('loaded');
                me.snapBack();
            }, 100);
        });
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].getItemId().substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                var tab = me.getActiveTab();
                if (tab == this) return;
                tab.removeCls('x-button-active');
                tab.addCls('x-button');
                tab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.setActiveTab(this);
            });
        }
        this.setActiveTab(btns[0]);
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scrollend', this.listPaging, this);
    },

    listPaging: function(scroller, x, y) {
        if (y <= 0 || y < scroller.maxPosition.y) {
            return;
        }
        var tabView = this.getActiveTab().tabView;
        tabView.nextPage && tabView.nextPage(scroller);
    }
})