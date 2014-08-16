Ext.define('WeiQuPai.view.MyCoupon', {
    extend: 'Ext.Container',
    xtype: 'mycoupon',
    requires: ['WeiQuPai.view.ExchangeCoupon'],
    config: {
        selectMode: false,
        cls: 'bg_ef',
        scrollable: 'vertical',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true,
            refreshFn: 'fetchLastest',
        }],
        items: [{
            xtype: 'vtitlebar',
            title: '我的拍券',
            docked: 'top'
        }, {
            xtype: 'dataview',
            store: 'MyCoupon',
            scrollable: null,
            loadingText: null,
            itemTpl: new Ext.XTemplate(
                '<div class="plist">',
                '<div class="m{coupon.value}">{coupon.name}</div>',
                '<div class="right" >过期时间：{expire_time} <tpl if="expired">[已过期]</tpl></div>',
                '<div style="clear:both"></div>',
                '</div>'
            ),
        }, {
            xtype: 'container',
            html: ['<div class="plist_shuo">',
                '<ul>',
                '<li style="margin:10px 0px;">',
                '<span >拍券使用规则：</span>',
                '</li>',
                '<li>',
                '拍券仅在购物时作为现金抵用',
                '</li>',
                '<li>',
                '一次购物只能使用一张',
                '</li>',
                '<li>',
                '拍券不找零',
                '</li>',
                '<li>',
                '要使用的拍券面额须高于商品当前价格',
                '</li>',
                '<li>',
                '拍券使用后,不可退回',
                '</li>',
                '</ul>',
                '</div>'
            ].join(""),

        }, {
            xtype: 'button',
            text: '积分兑换拍券',
            baseCls: 'w-button',
            action: 'exchangeCoupon'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var btn = {
            xtype: 'button'
        };
        if (this.config.selectMode) {
            btn.baseCls = 'arrow_left',
            btn.action = 'back';
        } else {
            btn.baseCls = 'user';
            btn.action = 'ucenter';
        }
        this.down('vtitlebar').add(btn);
        this.down('vtitlebar').bindEvent();

        this.down('button[action=exchangeCoupon]').on('tap', this.goExchange, this);

        this.loadData();
        this.on('activate', this.onActivate, this);
    },

    onActivate: function() {
        var msgType = [WeiQuPai.Notify.MSG_NEW_COUPON];
        //有新消息才刷新
        if (WeiQuPai.Notify.hasNotify(msgType)) {
            this.loadData();
            WeiQuPai.Notify.clearNotify(msgType);
        }
    },

    goExchange: function() {
        var exchangeView = Ext.create('WeiQuPai.view.ExchangeCoupon');
        //兑换成功之后要刷新本页
        exchangeView.on('exchanged', this.loadData, this);
        WeiQuPai.navigator.push(exchangeView);
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
        });
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        this.down('dataview').setLoadingText(null);
        var store = this.down('dataview').getStore();
        if (store.isLoading()) {
            return false;
        }
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
            Ext.isFunction(callback) && callback();
        }, this);
    }
});