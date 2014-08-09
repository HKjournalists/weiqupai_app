Ext.define('WeiQuPai.view.ShowUser', {
    extend: 'Ext.Container',
    xtype: 'showuser',
    requires: [
        'WeiQuPai.view.ShowUserLike', 'WeiQuPai.view.ShowUserDis', 'WeiQuPai.view.ShowUserFeed',
        'WeiQuPai.view.MyFollow', 'WeiQuPai.view.MyFen'
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
                '<div class="person_model"><img src="{[this.getBg(values)]}" width="100%" height="155"></div>',
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
                            return 'resources/images/def_person_bg.jpg';
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
            itemId: 'tabber',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '喜欢',
                cls: 'x-button-active',
                action: 'tab_showuserlike'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_showuserdis',
                text: '评论'
            }, {
                flex: 1,
                xtype: 'button',
                text: '晒单',
                action: 'tab_showuserfeed'
            }]

        }, {
            xtype: 'showuserlike',
        }, {
            xtype: 'showuserdis',
            hidden: true
        }, {
            xtype: 'showuserfeed',
            hidden: true
        }]
    },
    //当前激活的tab button
    activeTab: null,

    tabPosition: 0,
    initialize: function() {
        this.callParent(arguments);
        this.initTab();
        this.down('#personmodel').on('tap', this.bindEvent, this, {
            element: 'element'
        });
        this.on('painted', function() {
            this.tabPosition = this.down('#tabber').element.getY() + 40;
        });
    },

    applyUid: function(uid) {
        this.loadData(uid);
        this.down('showuserlike').setUid(uid);
        this.down('showuserdis').setUid(uid);
        this.down('showuserfeed').setUid(uid);
        return uid;
    },

    bindEvent: function(e) {
        if (e.target.className == 'myfollow') {
            this.fireEvent('followtap', this, e);
            return false;
        }
        if (e.target.className == 'myfans') {
            this.fireEvent('fanstap', this, e);
            return false;
        }
        if (Ext.get(e.target).hasCls('follow_btn')) {
            this.fireEvent('follow', this);
            return false;
        }
        if (e.target.className == 'avatar') {
            this.fireEvent('avatartap', this);
            return false;
        }
        this.fireEvent('bgtap', this);
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        var list = this.getList();
        var uid = list.getUid();
        list.loadData(uid, function() {
            me.setState('loaded');
            me.snapBack();
        });
        list.down('showuserlike').setUid(uid);
        list.down('showuserdis').setUid(uid);
        list.down('showuserfeed').setUid(uid);
    },

    loadData: function(uid, callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var person = this.down('#personmodel');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/user&uid=' + uid;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            person.setData(rsp);
           // console.log(rsp);
            me.down('button[action=tab_showuserlike]').setText('喜欢 ' + rsp.like_num);
            me.down('button[action=tab_showuserdis]').setText('评论 ' + rsp.comment_num);
            me.down('button[action=tab_showuserfeed]').setText('晒单 ' + rsp.show_order_num);
            Ext.isFunction(callback) && callback();
        });

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