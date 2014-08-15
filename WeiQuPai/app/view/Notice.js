Ext.define('WeiQuPai.view.Notice', {
    extend: 'Ext.DataView',
    xtype: 'notice',
    requires: [
        'WeiQuPai.view.NoticeToday', 'WeiQuPai.view.NoticeAfter', 'WeiQuPai.view.NoticeTomorrow'
    ],
    config: {
        uid: null,
        scrollable: true,
        cls: 'bg_ef',
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
            title: '精彩预告',
            cls: 'titlebar3',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'my_btn',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '今天',
                cls: 'x-button-active',
                action: 'tab_noticetoday',
                itemId: 'tab_noticetoday'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_noticetomorrow',
                itemId: 'tab_noticetomorrow',
                text: '明天'
            }, {
                flex: 1,
                xtype: 'button',
                text: '后天',
                action: 'tab_noticeafter',
                itemId: 'tab_noticeafter'
            }]

        }, {
            xtype: 'noticetoday',
        }, {
            xtype: 'noticetomorrow',
            hidden: true
        }, {
            xtype: 'noticeafter',
            hidden: true
        }]
    },
    //当前激活的tab button
    activeTab: null,

    tabPosition: 0,
    initialize: function() {
        this.callParent(arguments);
        this.initTab();
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        var loadCount = 0;
        var allLoad = function() {
            loadCount++;
            if (loadCount == 3) {
                me.setState('loaded');
                me.snapBack();
            }
        }
        this.getList().down('noticetoday').loadData(allLoad);
        this.getList().down('noticetomorrow').loadData(allLoad);
        this.getList().down('noticeafter').loadData(allLoad);
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].getItemId().substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                if (me.activeTab == this) return;
                me.activeTab.removeCls('x-button-active');
                me.activeTab.addCls('x-button');
                me.activeTab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.activeTab = this;
                me.getScrollable().getScroller().scrollTo(0, me.tabPosition, true);
            });
        }
        this.activeTab = btns[0];

        //tab的悬停效果
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroller, x, y) {
            if (y >= this.tabPosition) {
                var offset = y - this.tabPosition;
                this.down('#tabbar').translate(null, offset, false);
            }

        }, this);
    }
});