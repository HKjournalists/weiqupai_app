Ext.define('WeiQuPai.view.MyDiscount', {
    extend: 'Ext.DataView',
    xtype: 'mydiscount',
    config: {
        scrollable: true,
        cls: 'detail',
        scrollToTopOnRefresh: false,
        store: 'MyDiscount',
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
            '<div class="left"><img src="{[this.getPic(values)]}" width="110"></div>',
            '<div class="right">',
            '<div class="title">{discount.title}</div>',
            '<div class="dis">{discount.abstract}</div>',
            '<div class="time">有效期 {discount.expire_time}</div>',
            '<div class="time">使用地点 {discount.place}</div>',
            '</div>',
            '<div class="clear"></div>',
            '<tpl if="verify_code">',
                '<div class="bottom_eat">' ,
                    '<div class="DiscountBarCode floatleft">微趣拍验证码</div>',
                    '<div class="DiscountBarSuc color_e7 floatleft">{verify_code}</div>',
                    '<div class="clear"></div>',
                '</div>',
            '</tpl>',
            '</div>',{
                getPic: function(values){
                    if(values.type == 1){
                        return WeiQuPai.Util.getImagePath(values.discount.pic_url);
                    }else{
                        return WeiQuPai.Util.getImagePath(values.discount.pic_url, 200);
                    }
                }
            }
        ),

        items: [{
            xtype: 'vtitlebar',
            title: '我的优惠',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        this.getStore().on('load', WeiQuPai.Util.onStoreLoad, this);
        this.getStore().on('latestfetched', WeiQuPai.Util.onStoreLoad, this);
        this.loadData();
        this.on('itemtap', this.bindEvent, this);
        this.plugins
    },

    loadData: function() {
        this.setLoadingText(null);
        var store = this.getStore();
        var user = WeiQuPai.Cache.get('currentUser');
        store.getProxy().setExtraParam('token', user.token);
        //加载数据
        store.loadPage(1);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.get_btn')) {
            this.fireEvent('useit', this, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('showdetail', this, index, dataItem, record, e);
    }
});