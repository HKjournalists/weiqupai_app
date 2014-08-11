Ext.define('WeiQuPai.view.YiPai', {
    extend: 'Ext.DataView',
    xtype: 'yipai',
    config: {
        uid: null,
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
            scrollerAutoRefresh: true
        }],
        itemCls: 'list',
        baseCls: 'water-floow',
        itemTpl: new Ext.XTemplate(
            '<div class="yipailist">',
            '<div class="price">',
            '<div class="left">原:{item.oprice}</div>',
            '<div class="right">底:{item.oprice}</div>',
            '<div class="clear"></div>',
            '</div>',
            '<div>',
            '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 140)]}" class="img">',
            '<div class="zhezhao">',
            '{item.title}',
            '</div>',
            '</div>',
            '</div>',
            '<div>',
            '<tpl for="auctions">',
            '<div class="dis">',
            '<span id="yipai_price">',
            '<span class="yipai_name" uid="{uid}">{user.nick}</span><span class="color_e7"> {curr_price}</span>',
            '</div>',
            '</tpl>',
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

    initialize: function() {
        this.callParent(arguments);
        this.loadData();
        // var me=this;
        this.on('itemtap', function(list, index, dataItem, record, e) {
            if (Ext.get(e.target).findParent('.img')) {
                this.fireEvent('cardtap', this, index, dataItem, record, e);
                return false;
            }

            if (e.target.className == 'yipai_name') {
                var toUid = e.target.getAttribute('uid');
                this.fireEvent('persontap', this, index, record, e.target.getAttribute('uid'));
                return false;
            }
        }, this);

    },

    loadData: function(callback) {
        var store = this.getStore();
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
            Ext.isFunction(callback) && callback();
        });
    }
});