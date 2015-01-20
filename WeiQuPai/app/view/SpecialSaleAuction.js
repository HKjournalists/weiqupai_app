Ext.define('WeiQuPai.view.SpecialSaleAuction', {
    extend: 'Ext.DataView',
    xtype: 'specialsaleauction',
    requires: [
        'WeiQuPai.view.Item'
    ],
    config: {
        cls: 'bar bg_ef',
        store: 'SpecialSaleAuction',
        loadingText: null,
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
        }, {
            type: 'wlistpaging',
        }],
        itemCls: 'killend-item',
        itemTpl: new Ext.XTemplate(
            '<div class="bar_new special-sale" style="margin-top:7px;">',
            '<img src="{[this.getPic(values.item.pic_cover)]}" width="140"/>',
            '<div class="pool-info">',
                '<h3>{item.title}</h3>',
                '<p>原价：￥{item.oprice}</p>',
                '<div class="btn-info">',
                    '<div class="reserve-row">现价：<tpl if="this.isPostage(values)"><span class="price">付邮领用</span><tpl else>￥<span class="price">{curr_price}</span></tpl></div>',
                    '<div><input type="button" class="btn_create buy_btn" value="立即购买"/></div>',
                '</div>',
            '</div>',
            '</div>', {
                getPic: function(pic_cover) {
                    return WeiQuPai.Util.getImagePath(pic_cover, 200);
                },
                isPostage: function(values){
                    return values.postage == 1;
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '拍卖专场',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }],
    },

    initialize: function() {
        this.callParent(arguments);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);

        this.on('itemtap', this.bindEvent, this);
    },

    updateData: function(data) {
        this.down('vtitlebar').setTitle(data.title);
    },


    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.buy_btn')) {
            WeiQuPai.app.getController('Item').showOrderView(record.get('id'));
            return false;
        }
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
})