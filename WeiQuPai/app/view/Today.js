Ext.define('WeiQuPai.view.Today', {
    extend: 'Ext.DataView',
    xtype: 'today',
    requires: ['WeiQuPai.view.Banner', 'WeiQuPai.view.SpecialSale',
        'WeiQuPai.view.Discount', 'WeiQuPai.view.KillEndChannel', 'WeiQuPai.view.AuctionTip', 'WeiQuPai.view.CategoryWithSearch'
    ],
    config: {
        loadingText: null,
        store: 'KillEndToday',
        cls: 'bg_ef',
        id: 'dataviewlist',
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
        }, {
            type: 'wlistpaging'
        }],

        itemCls: 'killend-item',
        itemTpl: new Ext.XTemplate(
            '<div class="bar_new" style="margin-top:7px;">',
            '<img src="{[this.getPic(values.item.pic_cover)]}" width="140"/>',
            '<div class="pool-info">',
            '<h3>{item.title}</h3>',
            '<p>血战时限：{duration}小时</p>',
            '<p>开杀价：{start_price}</p>',
            '<p>剩余：{left_num}个</p>',
            '<div class="btn-info">',
            '<div class="reserve-row">底价：￥<span class="price">{reserve_price}</span></div>',
            '<div><input type="button" class="btn_create" value="{[this.getButtonText(values)]}"/></div>',
            '</div>',
            '</div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                },
                getPic: function(pic_cover) {
                    return WeiQuPai.Util.getImagePath(pic_cover, 200);
                },
                getButtonText: function(values) {
                    return values.selfId > 0 ? '我的实况' : '我要杀价';
                }
            }
        ),

        items: [{
            xtype: 'vtitlebar',
            title: '微趣拍',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }, {
                align: 'right',
                baseCls: 'list_btn',
                action: 'category'
            }]
        }, {
            xtype: 'banner',
            scrollDock: 'top'
        }, {
            xtype: 'container',
            style: 'background:#fff',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                baseCls: 'btn1',
                action: 'discount',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn2',
                action: 'killend',
                flex: 1
            }]
        }, {
            xtype: 'container',
            style: 'background:#fff',
            layout: 'hbox',
            items: [{

                xtype: 'button',
                baseCls: 'btn3',
                action: 'circle',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn4',
                flex: 1,
                action: 'luxuries'

            }]
        }, {
            xtype: 'container',
            itemId: 'specialList',
            layout: {
                type: 'hbox'
            },
            tpl: new Ext.XTemplate(
                '<div class="special">',
                '<tpl for=".">',
                '<div class="list-product" data-id="{id}">',
                '<img src="{[WeiQuPai.Util.getImagePath(values.pic_url)]}" width="60"/>',
                '<p>{title}</p>',
                '</div>',
                '</tpl>',
                '</div>'
            )
        }, {
            xtype: 'container',
            html: '今日精选',
            cls: 'todayTitle'
        }]
    },

    firstLoad: true,
    todayData: null,

    initialize: function() {
        var me = this;
        this.callParent(arguments);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);

        this.loadData(function() {
            if (Ext.os.is.android) {
                setTimeout(function() {
                    var scroller = me.getScrollable().getScroller();
                    scroller.refresh();
                }, 200);
            }
        });

        this.on('hide', this.onHide, this);
        this.on('itemtap', this.bindEvent, this);

        this.down('#specialList').on('tap', this.goSpecial, this, {
            element: 'element',
            delegate: '.list-product'
        });
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.btn_create')) {
            this.fireEvent('create', list, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('detail', list, index, dataItem, record, e);
    },

    //跳转专场
    goSpecial: function(e) {
        var id = Ext.get(e.target).findParent('.list-product').getAttribute('data-id');
        var url = WeiQuPai.Util.apiUrl('r=appv2/specialSale&id=' + id);
        WeiQuPai.Util.get(url, function(rsp) {
            var view = Ext.create(rsp.type == 1 ? 'WeiQuPai.view.SpecialSale' : 'WeiQuPai.view.SpecialSaleAuction');
            var query = WeiQuPai.Util.getDefaultParam();
            query['id'] = id;
            view.setData(rsp);
            view.getStore().getProxy().setExtraParams(query);
            view.getStore().currentPage = 1;
            view.getStore().setData(rsp.auctions);
            setTimeout(function(){
                WeiQuPai.navigator.push(view);
            }, 10);
        }, {
            mask: true
        });
    },

    loadData: function(callback) {
        var url = WeiQuPai.Util.apiUrl('r=appv2/todayV2');
        var me = this;
        WeiQuPai.Util.get(url, function(data) {
            me.getStore().setData(data.kill);
            me.down('#specialList').setData(data.special);
            me.down('banner').updateBanner(data.banner);
            me.todayData = data;
            WeiQuPai.Util.resetListPaging(me);
            callback && callback();
        });
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

    onHide: function() {
        this.down('banner').stopTimer();
    }
});