/**
 * 个人中心侧边栏
 */
Ext.define('WeiQuPai.view.Sidebar', {
    extend: 'WeiQuPai.plugin.Sidebar',
    xtype: 'sidebar',
    requires: ['WeiQuPai.view.Today', 'WeiQuPai.view.MyAuction', 'WeiQuPai.view.MyMessage',
        'WeiQuPai.view.MyOrder', 'WeiQuPai.view.Circle', 'WeiQuPai.view.MyDiscount', 'WeiQuPai.view.MyCoupon',
        'WeiQuPai.view.MyProp', 'WeiQuPai.view.Profile', 'WeiQuPai.view.Setting', 'WeiQuPai.view.ShowUser'
    ],
    config: {
        notLogin: ['today', 'circle', 'setting'],
        scrollable: true,
        cls: 'personal',
        layout: 'vbox',
        items: [{
            xtype: 'container',
            items: [{
                id: 'personal',
                tpl: new Ext.XTemplate(
                    '<div class="title">',
                    '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="50"/>',
                    '<span>{nick:htmlEncode}</span>',
                    '<div class="return"></div>',
                    '<div style="clear:both"></div>',
                    '</div>'
                )
            }]
        }, {
            xtype: 'button',
            flex: 1,
            text: '首页',
            id: 'today',
            cls: 'button_active',
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的拍卖',
            id: 'myauction'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的消息',
            id: 'mymessage'
        }, {
            xtype: 'button',
            flex: 1,
            text: '我的订单',
            id: 'myorder'
        }, {
            xtype: 'button',
            flex: 1,
            text: '拍圈',
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

    activeBtn: null,

    //左上角个人中心按钮是否已标红
    ucenterBadge: false,

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

    destroyLoginView: function() {
        var buttons = this.query('button');
        for (var i = 0; i < buttons.length; i++) {
            var xtype = buttons[i].getId();
            if (this.getNotLogin().indexOf(xtype) != -1) {
                continue;
            }
            var item = WeiQuPai.mainCard.down(xtype);
            item && WeiQuPai.mainCard.remove(item);
        }
    },

    bindEvent: function() {
        var buttons = this.query('button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].on('tap', function(btn) {
                if (btn == this.activeBtn) {
                    return this.toggle();
                }
                this.activeTabItem(btn.getId());
            }, this);
        }

        //跳转到个人中心
        this.down('#personal').on('tap', function() {
            this.toggle();
            var user = WeiQuPai.Util.checkLogin();
            if (!user) return;
            var showUser = Ext.create('WeiQuPai.view.ShowUser');
            showUser.setUid(user.id);
            WeiQuPai.navigator.push(showUser);
        }, this, {
            'element': 'element'
        });
    },

    open: function() {
        if (this.getState() == 'open') {
            return;
        }
        this.toggle();
    },

    close: function() {
        if (this.getState() == 'closed') {
            return;
        }
        this.toggle();
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

    activeTabBtn: function(btn) {
        if (Ext.isString(btn)) {
            btn = this.down('#' + btn);
        }
        btn.addCls('button_active');
        this.activeBtn.removeCls('button_active');
        this.activeBtn = btn;
    },

    activeTabItem: function(xtype) {
        //需要登录
        if (this.getNotLogin().indexOf(xtype) == -1 && !WeiQuPai.Util.isLogin()) {
            WeiQuPai.loginReferer = xtype;
            WeiQuPai.navigator.push({
                xtype: 'login'
            });
            this.close();
            return;
        }
        var mainCard = WeiQuPai.mainCard;
        var item = mainCard.down(xtype);
        if (!item) {
            mainCard.add({
                xtype: xtype
            });
        }
        this.activeTabBtn(xtype);
        mainCard.setActiveItem(xtype);
        //如果有通知要在对应view上的个人中心按钮显示红点
        if (WeiQuPai.Notify.hasNotify()) {
            var item = mainCard.getActiveItem();
            var btn = item.down('button[action=ucenter]');
            btn.addCls('w-hasbadge');
            btn.element.down('.x-badge').show();
        }
        this.close();
    },

    setUcenterBadge: function() {
        if (this.ucenterBadge) {
            return;
        }
        this.ucenterBadge = true;
        var btns = WeiQuPai.navigator.query('button[action=ucenter]');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addCls('w-hasbadge');
            btns[i].element.down('.x-badge').show();
        }
    },

    clearUcenterBadge: function() {
        if (!this.ucenterBadge) {
            return;
        }
        this.ucenterBadge = false;
        var btns = WeiQuPai.navigator.query('button[action=ucenter]');
        for (var i = 0; i < btns.length; i++) {
            btns[i].removeCls('w-hasbadge');
            btns[i].element.down('.x-badge').hide();
        }
    },

    setBadge: function(tab) {
        var tabBtn = this.down('#' + tab);
        tabBtn.addCls('w-hasbadge');
        tabBtn.element.down('.x-badge').show();
        this.setUcenterBadge();
    },

    clearBadge: function(tab) {
        var tabBtn = this.down('#' + tab);
        tabBtn.removeCls('w-hasbadge');
        tabBtn.element.down('.x-badge').hide();
        if (!WeiQuPai.Notify.hasNotify()) {
            this.clearUcenterBadge();
        }
    }
});