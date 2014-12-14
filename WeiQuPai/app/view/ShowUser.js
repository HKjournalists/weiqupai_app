Ext.define('WeiQuPai.view.ShowUser', {
    extend: 'Ext.Container',
    xtype: 'showuser',
    requires: [
        'WeiQuPai.view.ShowUserLike', 'WeiQuPai.view.ShowUserDis', 'WeiQuPai.view.ShowUserFeed',
        'WeiQuPai.view.MyFollow', 'WeiQuPai.view.MyFen', 'WeiQuPai.view.ChangeAvatarLayer',
        'WeiQuPai.view.PrivateMessage'
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
            xtype: 'container',
            itemId: 'personmodel',
            tpl: new Ext.XTemplate(
                '<div class="person_model"><img src="{[this.getBg(values)]}"></div>',
                '<div class="person_zhezhao">',
                '<div class="one">',
                '<div class="head">',
                '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="70" class="avatar"><br>',

                '</div>',
                '<div class="right">',
                '<div width="100%;">',
                '<div class="name">',
                '{nick}',
                '</div>',
                '<div class="dis">',
                '{score}',
                '</div>',

                '</div><br>',
                '<div>',
                '<div class="exp">',
                '{score}',
                '</div>',
                '</div>',
                '<div class="des">',
                '{sign}',
                '</div>',
                '</div>',
                '</div>',
                '<div style="clear:both"></div>',
                '<div class="two">',
                '<tpl if="!this.isSelf(values)">',
                '<div class="title follow_btn">+关注</div>',
                '</tpl>',

                '<span>',
                '<label class="myfollow">关注{follow_num}</label>&nbsp;|',
                '<label class="myfans">&nbsp;粉丝{fans_num}</label>',
                '</span>',
                '<tpl if="!this.isSelf(values)">',
                '<div class="email">私信TA</div>',
                '</tpl>',
                '</div>',
                '</div>', {
                    getBg: function(values) {
                        if (!values.circle_bg) {
                            return 'resources/images/def_person_bg.png';
                        }
                        return WeiQuPai.Util.getImagePath(values.circle_bg);
                    },
                    isSelf: function(values) {
                        var user = WeiQuPai.Cache.get('currentUser');
                        return user && user.id == values.id;
                    }
                }
            )
        }, {
            xtype: 'vtitlebar',
            title: '个人主页',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'my_btn',
            style: 'position:relative;z-index:100',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '喜欢',
                cls: 'x-button-active',
                action: 'tab_showuserlike',
                itemId: 'tab_showuserlike'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_showuserdis',
                itemId: 'tab_showuserdis',
                text: '评论'
            }, {
                flex: 1,
                xtype: 'button',
                text: '晒单',
                action: 'tab_showuserfeed',
                itemId: 'tab_showuserfeed'
            }]

        }, {
            xtype: 'showuserlike',
        }, {
            xtype: 'showuserdis',
            hidden: true
        }, {
            xtype: 'showuserfeed',
            hidden: true
        }],
        //当前激活的tab button
        activeTab: null
    },

    tabPosition: 0,
    initialize: function() {
        this.callParent(arguments);
        this.initTab();
        this.down('#personmodel').on('tap', this.bindEvent, this, {
            element: 'element'
        });
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    bindEvent: function(e) {
        if (e.target.className == 'myfollow') {
            this.fireEvent('followtap', this);
            return false;
        }
        if (e.target.className == 'myfans') {
            this.fireEvent('fanstap', this);
            return false;
        }
        if (Ext.get(e.target).hasCls('follow_btn')) {
            this.fireEvent('follow', this);
            return false;
        }
        if (e.target.className == 'email') {
            this.fireEvent('pm', this);
            return false;
        }
        this.fireEvent('bgtap', this);
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        var list = this.getList();
        var uid = list.getUid();
        var loadedCount = 0;
        list.loadData(uid, function() {
            loadedCount++;
            if (loadedCount < 4) return;
            setTimeout(function() {
                me.setState('loaded');
                me.snapBack();
            }, 100);
        });
    },

    applyData: function(data) {
        this.down('#personmodel').setData(data);
        this.down('button[action=tab_showuserlike]').setText('喜欢 ' + data.like_num);
        this.down('button[action=tab_showuserdis]').setText('评论 ' + data.comment_num);
        this.down('button[action=tab_showuserfeed]').setText('晒单 ' + data.show_order_num);
        return data;
    },

    loadData: function(uid, callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var person = this.down('#personmodel');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/user&uid=' + uid;
        var me = this;
        me.down('showuserlike').loadData(uid, callback);
        me.down('showuserdis').loadData(uid, callback);
        me.down('showuserfeed').loadData(uid, callback);
        WeiQuPai.Util.get(url, function(rsp) {
            me.setData(rsp);
            Ext.isFunction(callback) && callback();
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
                setTimeout(function() {
                    var scroller = me.getScrollable().getScroller();
                    if (scroller.position.y > me.tabPosition) {
                        scroller.scrollTo(null, me.tabPosition, true);
                    }
                }, 100);
            });
        }
        this.setActiveTab(btns[0]);

        //tab的悬停效果
        this.on('painted', function() {
            var me = this;
            //不使用timeout获取的值有可能不对
            setTimeout(function() {
                me.tabPosition = me.down('#tabbar').element.getY() - me.down('vtitlebar').element.getHeight();
            }, 400);
        }, this, {
            single: true
        });
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroller, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabbar').translate(null, y - this.tabPosition, false);
            } else {
                this.down('#tabbar').translate(null, 0, false);
            }
        }, this);
        scroller.addListener('scrollend', this.listPaging, this);
    },

    listPaging: function(scroller, x, y) {
        if (y < scroller.maxPosition.y) {
            return;
        }
        var tabView = this.getActiveTab().tabView;
        tabView.nextPage && tabView.nextPage(scroller);
    }
});