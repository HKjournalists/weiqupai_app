Ext.define('WeiQuPai.view.YiPai', {
    extend: 'Ext.DataView',
    xtype: 'yipai',
    config: {
        loadingText: null,
        store: 'Auction',
        cls: 'bg_ef yi_product',
        store: 'YiPai',
        disableSelection: true,
        scrollToTopOnRefresh: false,
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            refreshFn: 'fetchLastest',
            scrollerAutoRefresh: true
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="list">',
            '<div class="yipailist">',
            '<div class="price">',
            '<div class="left">原价:{item.oprice}</div>',
            '<div class="right">低价:{item.oprice}</div>',
            '<div class="clear"></div>',
            '</div>',
            '<div>',
            '<img src="{[WeiQuPai.Util.getAvatar(values.item.pic_cover, 140)]}" class="img">',
            '<div class="zhezhao">',
            '{item.title}',
            '</div>',
            '</div>',
            '</div>',
            '<div>',
            '<tpl for="auctions">',
            '<div class="dis">',
            '<span id="yipai_price">',
            '<span class="yipai_name">{user.nick}</span><span class="color_e7"> {curr_price}</span>',
            '</div>',
            '</tpl>',
            '</div>',
            '</div>'
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '一拍到底',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'yipai',
            layout: 'hbox',
            items: [{
                xtype: 'panel',
                baseCls: 'step1',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step2',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step3',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step4',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step5',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'success',
                flex: 1
            }]
        }]
    },

    firstLoad: true,
    todayData: null,

    initialize: function() {
        this.callParent(arguments);
        this.loadData();
        this.on('itemtap', function(list, index, dataItem, record, e) {
            if (Ext.get(e.target).findParent('.img')) {
                this.fireEvent('cardtap', this, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'yipai_name') {
                this.fireEvent('persontap', this, index, dataItem, record, e);
                console.log(index + "+" + this + "+" + record + "+" + e);
                return false;
            }
        }, this);

    },
    loadData: function() {
        // var user = WeiQuPai.Cache.get('currentUser');
        // var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionPool';
        // var me = this;
        // WeiQuPai.Util.get(url, function(data) {
        //     me.down('#yipai').setData(data);
        // });
        var store = this.getStore();
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
        });
    },

    onHide: function() {
        this.down('banner').stopTimer();
    }
});