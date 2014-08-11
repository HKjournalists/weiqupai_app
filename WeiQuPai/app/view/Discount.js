Ext.define('WeiQuPai.view.Discount', {
    extend: 'Ext.DataView',
    xtype: 'discount',
    config: {
        scrollable: true,
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
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="discount">',
            '<div class="left"><img src="{[WeiQuPai.Util.getImagePath(values.pic_url)]}" width="110"></div>',
            '<div class="right">',
            '<div class="title">{title}</div>',
            '<div class="dis">{description}</div>',
            '<div class="time"><input type="button" value="分享领取" class="btn_e7 get_btn"/>有效期 {expire_time}</div>',
            '</div>',
            '<div class="clear"></div>',
            '</div>'
        ),

        items: [{
            xtype: 'vtitlebar',
            title: '惠吃惠喝',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox('您还没有拍到任何宝贝');
        this.add(this.msgbox);
        this.loadData();
        this.on('itemtap', this.bindEvent, this);
    },

    loadData: function() {
        this.setLoadingText(null);
        var store = this.getStore();
        var user = WeiQuPai.Cache.get('currentUser');
        store.getProxy().setExtraParam('token', user.token);
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
        }
    }
});