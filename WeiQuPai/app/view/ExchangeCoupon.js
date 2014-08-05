Ext.define('WeiQuPai.view.ExchangeCoupon', {
    extend: 'Ext.DataView',
    xtype: 'exchangecoupon',
    requires: ['WeiQuPai.view.ExchangeLayer'],
    config: {
        cls: 'bg_ef',
        loadingText: null,
        store: 'Coupon',
        itemCls: 'change',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true,
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="card">',
            '<div class="m{value}"></div>',
            '<div class="jifen">{score}</div>',
            '<div class="btn"><input type="button" value="兑换" class="btn_e7"/></div>',
            '</div>'
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '积分兑换拍券',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'button',
            text: '0',
            itemId: 'score',
            baseCls: 'orderdetail_btn6'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.loadData();
        var user = WeiQuPai.Cache.get('currentUser');
        this.down('button').setText(user.score);
        this.exchangeLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ExchangeLayer');
        this.exchangeLayer.setCallback(this.exchange);
        this.exchangeLayer.setScope(this);
        this.on('itemtap', this.showLayer);
    },

    loadData: function(callback) {
        this.getStore().load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
    },

    showLayer: function(list, index, dataItem, record, e) {
        this.exchangeLayer.show();
    },

    exchange: function(num) {
        var me = this;
        var coupon_id = this.getSelection()[0].get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/exchange/coupon';
        var data = {
            token: user.token,
            coupon_id: coupon_id,
            num: num
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            WeiQuPai.Util.toast('兑换成功');
            WeiQuPai.Util.updateUserCache('score', rsp.score);
            me.down('button').setText(rsp.score);
            me.exchangeLayer.hide();
            me.fireEvent('exchanged');
        }, {
            mask: true
        });
    }
});