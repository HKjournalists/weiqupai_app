Ext.define('WeiQuPai.view.MyProp', {
    extend: 'Ext.Container',
    xtype: 'myprop',
    requires: ['WeiQuPai.view.ExchangeProp'],
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
            title: '我的道具',
            docked: 'top'
        }, {
            xtype: 'dataview',
            store: 'MyProp',
            scrollable: null,
            loadingText: null,
            itemTpl: new Ext.XTemplate(
                '<div class="prop-list">',
                '<div class="left {prop.action}"></div>',
                '<div class="prop-desc">',
                '<div class="name">{prop.name} * {num}</div>',
                '<div class="desc">{prop.description}</div>',
                '</div>',
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
            text: '积分兑换道具',
            baseCls: 'w-button',
            action: 'exchangeProp'
        }]
    },

    initialize: function() {
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

        this.loadData();
        this.down('button[action=exchangeProp]').on('tap', this.goExchange, this);
    },

    goExchange: function() {
        var exchangeView = Ext.create('WeiQuPai.view.ExchangeProp');
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
        var store = this.down('dataview').getStore();
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
            Ext.isFunction(callback) && callback();
        }, this);
    }
});