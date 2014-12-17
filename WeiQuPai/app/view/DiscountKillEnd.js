Ext.define('WeiQuPai.view.DiscountKillEnd', {
    extend: 'Ext.DataView',
    xtype: 'discountkillend',
    requires: ['WeiQuPai.view.DiscountDetail'],
    config: {
        cls: 'detail',
        scrollToTopOnRefresh: false,
        store: 'DiscountKillEnd',
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
            '<div class="left"><img src="{[this.getPic(values.item.pic_cover)]}" width="110"></div>',
            '<div class="right">',
            '<div class="title">{item.title}</div>',
            '<div class="dis">{item.description}</div>',
            '<div class="text">使用期限:{item.expire_time}</div>',
            '<div class="text">使用地点:{item.place}</div>',
            '</div>',
            '<div class="bottom_eat">',
                '<div class="mg">',
                   '<div class="dis">血战时限:{duration}小时</div>',
                   '<div class="dis">开杀价:{start_price}</div>',
                 '</div>',
                '<div class="mg" style="padding-left:10px;">',
                    '<div class="dis">价值:{item.oprice}</div>',
                    '<div class="dis discolor">底价:{reserve_price}</div>',
                '</div>',
                '<div class="btn mg"><input type="button" class="btn_create" value="{[this.getButtonText(values)]}" /></div>',
                '<div class="clear"></div>',
            '</div>',
            '</div>', {
                getPic: function(pic_cover) {
                    return WeiQuPai.Util.getImagePath(pic_cover, 200);
                },
                getButtonText: function(values) {
                    return values.selfId > 0 ? '我的实况' : '我要杀价';
                }
            }
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
        if (store.isLoading()) {
            return;
        }
        var user = WeiQuPai.Cache.get('currentUser');
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
         if (Ext.get(e.target).findParent('.btn_create')) {
            this.fireEvent('create', list, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('detail', list, index, dataItem, record, e);
    }
});