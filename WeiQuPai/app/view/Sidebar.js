/**
 * 个人中心侧边栏
 */
Ext.define('WeiQuPai.view.Sidebar', {
    extend: 'WeiQuPai.plugin.Sidebar',
    xtype: 'sidebar',
    requires: ['WeiQuPai.plugin.Sidebar', 'WeiQuPai.view.ShowUser', 'WeiQuPai.view.MyAuction',
        'WeiQuPai.view.Message', 'WeiQuPai.view.MyOrder', 'WeiQuPai.view.Circle',
        'WeiQuPai.view.MyDiscount', 'WeiQuPai.view.MyCoupon', 'WeiQuPai.view.MyProp',
        'WeiQuPai.view.Profile', 'WeiQuPai.view.Setting'
    ],
    config: {
        activeBtn: null,
        scrollable: true,
        cls: 'personal',
        layout: 'vbox',
        items: [{
            xtype: 'container',
            items: [{
                id: 'personal',
                tpl: new Ext.XTemplate(
                    '<div class="title">',
                    '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 100)]}" width="50"/>',
                    '<span>{nick:htmlEncode}</span>',
                    '<div class="return"></div>',
                    '<div style="clear:both"></div>',
                    '</div>'
                ),

            }]
        }, {
            xtype: 'button',
            flex: 1,
            text: '首页',
            id: 'today',
            cls: 'button_active',
            action: 'ucenter'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的拍卖',
            id: 'myauction'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的消息',
            id: 'message'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的订单',
            id: 'myorder'
        }, {
            xtype: 'button',
            flex: 1,
            text: '拍卖圈',
            id: 'circle'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的优惠',
            id: 'mydiscount'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的拍券',
            id: 'mycoupon'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的道具',
            id: 'myprop'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的资料',
            id: 'profile'
        }, {
            xtype: 'button',
            flex: 1,
            text: '系统设置',
            id: 'setting'
        }]
    },
    initialize: function() {
        this.activeBtn = this.down('#today');
        this.callParent(arguments);
        this.bindEvent();
        this.updateUserInfo();
    },

    updateUserInfo: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var data = {
            'avatar': null,
            'nick': '请登录'
        };
        if (user) {
            data = {
                'avatar': user.avatar,
                'nick': user.nick
            }
        }
        this.down('#personal').setData(data);
    },

    bindEvent: function() {
        var buttons = this.query('button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].on('tap', function(btn) {
                if (btn == this.activeBtn) {
                    return this.toggle();
                }
                btn.addCls('button_active');
                this.activeBtn.removeCls('button_active');
                this.activeBtn = btn;
                this.activeTabItem(btn.getId());

            }, this);
        }

        //跳转到个人中心
        this.down('#personal').on('tap', function() {

            this.toggle();
            var user = WeiQuPai.Util.checkLogin();
            if (!user) return;
            var uid = user.id;
            WeiQuPai.Util.forward('showuser', {
                uid: uid
            });
            // console.log(uid);
        }, this, {
            'element': 'element'
        });
    },

    //重写toggle，使点main view的任何区域都可以变回close状态
    toggle: function() {
        this.callParent();
        //如果是close则去掉mask
        var activeView = Ext.Viewport.getActiveItem();
        if (this.getState() == 'closed') {
            activeView.setMasked(false);
        } else {
            var sidebar = this;
            var mask = activeView.getMasked();
            if (!mask) {
                mask = Ext.create('Ext.Mask', {
                    transparent: true
                });
                mask.on('tap', function() {
                    sidebar.toggle();
                });
            }
            activeView.setMasked(mask);
        }
    },

    activeTabItem: function(xtype) {
        var mainCard = Ext.Viewport.down('maincard');
        var item = mainCard.down(xtype);
        if (!item) {
            var view = {
                xtype: xtype
            };
            mainCard.add(view);
        }
        mainCard.setActiveItem(xtype);
        this.toggle();
    },

    setBadge: function(tab) {
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge w-badge-sdot');
        tab.element.addCls('x-hasbadge');
        tab.badgeElement.show();
    },

    setBadgeText: function(tab, text) {
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge');
        tab.setBadgeText(text);
    },

    clearBadge: function(tab) {
        var tabList = ['today', 'myauction', 'circle', 'my'];
        var idx = tabList.indexOf(tab);
        var tab = this.query('tab')[idx];
        tab.setBadgeCls('x-badge');
        tab.element.removeCls('x-hasbadge');
        tab.badgeElement.hide();
    }
});