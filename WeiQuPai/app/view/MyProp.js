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
                '<ul><li style="margin:10px 0px;"><span >道具使用规则：</span></li>',
                '<li>* 在参与血战到底的时候可以使用道具</li>',
                '<li>* 每个独立的血战同一种道具只可以使用1次</li>',
                '<li>* 道具可以通过积分兑换得来，每次评论、喜欢、购买等操作均可以获取积分</li>',
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
        this.on('activate', this.onActivate, this);
    },

    onActivate: function() {
        //有新消息才刷新
        var msgType = WeiQuPai.Notify.MSG_NEW_PROP;
        if (WeiQuPai.Notify.hasNotify(msgType)) {
            this.loadData();
            WeiQuPai.Notify.clearNotify(msgType);
        }
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
            setTimeout(function() {
                me.setState('loaded');
                me.snapBack();
            }, 100);
        });
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        this.down('dataview').setLoadingText(null);
        var store = this.down('dataview').getStore();
        if (store.isLoading()) {
            return false;
        }
        var query = WeiQuPai.Util.getDefaultParam();
        store.getProxy().setExtraParams(query);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
            Ext.isFunction(callback) && callback();
        }, this);
    }
});