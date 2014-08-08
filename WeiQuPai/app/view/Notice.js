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
            itemId: 'tabber',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '今天',
                cls: 'x-button-active',
                action: 'tab_noticetoday'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_noticetomorrow',
                text: '明天'
            }, {
                flex: 1,
                xtype: 'button',
                text: '后天',
                action: 'tab_noticeafter'
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
        // this.down('#personmodel').on('tap', this.bindEvent, this, {
        //     element: 'element'
        // });
        // this.on('painted', function() {
        //     this.tabPosition = this.down('#tabber').element.getY() + 40;
        // });
    },

    initTab: function() {
        var btns = this.query('#tabber button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].action.substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                if (me.activeTab == this) return;
                me.activeTab.removeCls('x-button-active');
                me.activeTab.addCls('x-button');
                me.activeTab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.activeTab = this;
                me.getScrollable().getScroller().scrollTo(0, me.tabPosition, false);
            });
        }
        this.activeTab = btns[0];

        //tab的悬停效果
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroler, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabber').setDocked('top');
            } else {
                this.down('#tabber').setDocked(null);
            }


        }, this);
    }
});