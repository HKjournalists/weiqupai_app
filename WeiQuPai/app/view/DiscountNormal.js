Ext.define('WeiQuPai.view.DiscountNormal', {
    extend: 'Ext.DataView',
    xtype: 'discountnormal',
    requires: ['WeiQuPai.view.DiscountDetail'],
    config: {
        cls: 'detail',
        scrollToTopOnRefresh: false,
        store: 'Discount',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true
        }, {
            type: 'wlistpaging'
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="discount">',
            '<div class="left"><img src="{[WeiQuPai.Util.getImagePath(values.pic_url)]}" width="110"></div>',
            '<div class="right">',
            '<div class="title">{title}</div>',
            '<div class="dis">{abstract}</div>',
            '<div class="time">有效期 {expire_time}</div>',
            '</div>',
            '<div class="clear"></div>',
            '</div>'
        )
    },

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        this.loadData();
        this.on('itemtap', this.bindEvent, this);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);
    },

    loadData: function() {
        this.setLoadingText(null);
        var store = this.getStore();
        var user = WeiQuPai.Cache.get('currentUser');
        if(store.isLoading()){
            return;
        }
        store.getProxy().setExtraParam('token', user && user.token || '');
        //加载数据
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if (records.length == 0) {
                this.msgbox.show();
                return;
            }
            //登录超时
            if (!WeiQuPai.Util.invalidToken(records[0].raw)) {
                store.removeAll();
                return false;
            }
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.get_btn')) {
            this.fireEvent('getit', this, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('showdetail', list, index, dataItem, record, e);
    }
});