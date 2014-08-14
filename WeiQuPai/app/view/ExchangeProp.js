Ext.define('WeiQuPai.view.ExchangeProp', {
    extend: 'Ext.DataView',
    xtype: 'exchangeprop',
    requires: ['WeiQuPai.view.ExchangeLayer'],
    config: {
        cls: 'bg_ef',
        loadingText: null,
        store: 'Prop',
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
            '<div class="prop-list">',
            '<div class="exchange_btn"><input type="button" value="兑换" class="btn_e7"/></div>',
            '<div class="left"><div class="{action}"></div><div class="score">{score}</div></div>',
            '<div class="prop-desc">',
            '<div class="name">{name}</div>',
            '<div class="desc">{description}</div>',
            '</div>',
            '</div>'
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '积分兑换道具',
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
        this.exchangeLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ExchangeLayer');
        this.exchangeLayer.setCallback(this.exchange);
        this.exchangeLayer.setScope(this);
        this.on('itemtap', this.showLayer);
    },

    loadData: function(callback) {
        var me = this;
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myScore&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            me.down('button').setText(rsp.score);
        });
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
        var record = this.getSelection()[0];
        var prop_id = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/exchange/prop';
        var data = {
            token: user.token,
            prop_id: prop_id,
            num: num
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            WeiQuPai.Util.updateUserCache('score', rsp.score);
            me.down('button').setText(rsp.score);
            WeiQuPai.Util.toast('兑换成功');
            me.exchangeLayer.hide();
            me.fireEvent('exchanged');
        }, {
            mask: true
        });
    }
});