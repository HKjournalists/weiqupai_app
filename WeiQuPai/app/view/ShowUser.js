Ext.define('WeiQuPai.view.ShowUser', {
    extend: 'Ext.Container',
    xtype: 'showuser',
    config: {
        uid: null,
        // plugins: [{
        //     type: 'wlistpaging',
        //     autoPaging: true,
        // }, {
        //     type: 'wpullrefresh',
        //     lastUpdatedText: '上次刷新：',
        //     lastUpdatedDateFormat: 'H点i分',
        //     loadingText: '加载中...',
        //     pullText: '下拉刷新',
        //     releaseText: '释放立即刷新',
        //     loadedText: '下拉刷新'
        // }],
        // loadingText: null,
        // pressedCls: '',
        // param: null,
        // store: 'UserFeed',
        // disableSelection: true,
        // itemTpl: new Ext.XTemplate(
        //     '<div class="user-row"><div class="info">',
        //     '<tpl if="feed_type==0">',
        //     '<p>{content:htmlEncode}</p>',
        //     '<tpl elseif="feed_type==1">',
        //     '<tpl if="content"><p>{content:htmlEncode}</p></tpl>',
        //     '<div class="pic-list">',
        //     '<tpl for="json_data.pic_list"><img src="{[this.getCover(values)]}"/></tpl>',
        //     '</div>',
        //     '<div class="card" dataType="item">',
        //     '<img src="{[this.getCover(values.json_data.pic_cover)]}"/>',
        //     '<span>{json_data.title:htmlEncode}</span>',
        //     '</div>',
        //     '<tpl elseif="feed_type==2">',
        //     '<div class="action-title"><span class="uname" uid="{uid}">{nick:htmlEncode}</span><span class="action">拍下了一个宝贝</span></div>',
        //     '<p>我刚刚购买了{json_data.title:htmlEncode}</p>',
        //     '<div class="card" dataType="item">',
        //     '<img src="{[this.getCover(values.json_data.pic_cover)]}"/>',
        //     '<span>{json_data.title:htmlEncode}</span>',
        //     '</div>',
        //     '</tpl>',
        //     '<div class="flex"><span class="time">{ctime}</span></div>',
        //     '</div></div>', {
        //         getAvatar: function(avatar) {
        //             return WeiQuPai.Util.getImagePath(avatar, '140');
        //         },
        //         getCover: function(cover) {
        //             return WeiQuPai.Util.getImagePath(cover, '290');
        //         },
        //         getPic: function(pic) {
        //             return WeiQuPai.Util.getImagePath(pic, '40');
        //         }
        //     }
        // ),
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'container',
            // cls: 'person_model',
            store: 'MyCoupon',
            itemId: 'personmodel',
            tpl: new Ext.XTemplate(
                '<div class="person_model"><img src="{[WeiQuPai.Util.getAvatar(values.circle_bg)]}" width="100%"></div>',
                '<div class="person_zhezhao">',
                '<div class="one">',
                '<div class="head">',
                '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="70"><br>',

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
                '<div class="title">',
                '+关注',
                '</div>',

                '<span>',
                '<label class="myfollow">关注{follow_num}</label>&nbsp;|',
                '<label class="myfans">&nbsp;粉丝{fans_num}</label>',
                '</span>',
                '<div class="email">',
                '私信TA',
                '</div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'vtitlebar',
            title: '个人主页',
            cls: 'titlebar3',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }, {
                align: 'right',
                baseCls: 'refresh'
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'my_btn',
            itemId: 'tabber',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '喜欢 82',
                action: 'tab_showuserlike'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_showuserdis',
                text: '评论  112'
            }, {
                flex: 1,
                xtype: 'button',
                text: '晒单  234',
                action: 'tab_showuserfeed'
            }]

        }, {
            xtype: 'showuserlike'
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
        this.down('#personmodel').onBefore('tap', this.bindEvent, this, {
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
        //卡片点击
        var me = this;
        if (e.target.className == 'myfollow') {
            me.fireEvent('followtap', me, e);
            return false;
        }
        if (e.target.className == 'myfans') {
            var uid = e.target.getAttribute('uid');
            me.fireEvent('fanstap', me, e);
            return false;
        }
        var card = Ext.get(e.target).up('.card');
        if (card) {
            this.fireEvent('cardtap', this, index, record, card.getAttribute('dataType'));
            return false;
        }
    },

    loadData: function(uid) {
        var user = WeiQuPai.Cache.get('currentUser');
        var person = this.down('#personmodel');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/user&uid=' + uid;
        WeiQuPai.Util.get(url, function(rsp) {
            person.setData(rsp);
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