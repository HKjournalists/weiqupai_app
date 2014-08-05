Ext.define('WeiQuPai.view.Item', {
    extend: 'Ext.Container',
    xtype: 'item',
    requires: [
        'WeiQuPai.view.Comment', 'WeiQuPai.view.ItemParam', 'WeiQuPai.view.ItemDesc',
        'WeiQuPai.view.Shop', 'WeiQuPai.view.Brand', 'WeiQuPai.view.DetailPicShow',
        'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ImageViewer', 'WeiQuPai.view.ShareLayer'
    ],
    config: {
        scrollable: true,
        cls: 'detail',
        items: [{
            xtype: 'vtitlebar',
            title: '拍品详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'

            }, {
                align: 'right',
                baseCls: 'refresh',
                action: 'refresh'
            }]
        }, {
            xtype: 'detailpicshow'
        }, {
            xtype: 'container',
            id: "item_stat",
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="top" style="margin-top:-201px;">',
                '<div class="right">',
                '<ul>',
                '<li class="heart">{item_stat.like_num}</li>',
                '<li class="nolike">{item_stat.dislike_num}</li>',
                '<li class="pre">{item_stat.comment_num}</li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            id: 'item_title',
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="bottom" style="margin-top:110px;">',
                '<div class="left">',
                '{title}',
                '</div>',
                '<div class="right">',
                '<ul>',
                '<li class="nolike"></li>',
                '<li class="like"></li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            id: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="left">',
                '<div class="price">',
                '<span>原价￥{oprice}</span>',
                ' 已售出:{item_stat.sold_num}',
                '</div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'log_btn',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '商品参数',
                action: 'tab_itemparam',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_comment',
                text: '大家评论'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                text: '图文详情'
            }]
        }, {
            xtype: 'itemparam'
        }, {
            xtype: 'comment',
            hidden: true
        }, {
            xtype: 'itemdesc',
            hidden: true
        }],

        //当前激活的tab button
        activeTab: null

    },


    initialize: function() {
        this.callParent(arguments);

        this.shareLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        //初始化tab
        this.initTab();
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].action.substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                var tab = me.getActiveTab();
                if (tab == this) return;
                tab.removeCls('x-button-active');
                tab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.setActiveTab(this);
            });
        }
        this.setActiveTab(btns[0]);

        //tab的悬停效果
        /*
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroler, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabbar').setDocked('top');
            } else {
                this.down('#tabbar').setDocked(null);
            }


        }, this);
*/
    },

    loadData: function() {
        var item = item.getRecord();
        item.load(record.get('id'), {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
                //添加数据到分享功能
                this.shareLayer.setShareData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    applyRecord: function(record) {
        if (record == null) {
            return null;
        }
        this.down('comment').setItemId(record.get('id'));

        var data = record.data;
        this.down('detailpicshow').setPicData(data.pic_url);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        return record;
    }
});