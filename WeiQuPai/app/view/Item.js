Ext.define('WeiQuPai.view.Item', {
    extend: 'Ext.Container',
    xtype: 'item',
    requires: [
        'WeiQuPai.view.CommentList', 'WeiQuPai.view.ItemParam', 'WeiQuPai.view.ItemDesc',
        'WeiQuPai.view.Shop', 'WeiQuPai.view.Brand', 'WeiQuPai.view.DetailPicShow',
        'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ImageViewer', 'WeiQuPai.view.ShareLayer'
    ],
    config: {
        scrollable: true,
        cls: 'detail',
        loadingText: null,
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
        items: [{
            xtype: 'vtitlebar',
            title: '拍品详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'

            }]
        }, {
            xtype: 'detailpicshow'
        }, {
            xtype: 'container',
            itemId: "item_stat",
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
            itemId: 'item_title',
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="bottom" style="margin-top:110px;">',
                '<div class="right">',
                '<ul>',
                '<li class="{[this.getDislikeCls(values)]}"></li>',
                '<li class="{[this.getLikeCls(values)]}"></li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>', {
                    getLikeCls: function(values) {
                        var id = parseInt(values.id);
                        return WeiQuPai.Util.hasCache('item_like', id) ? 'selflike' : 'like';
                    },
                    getDislikeCls: function(values) {
                        var id = parseInt(values.id);
                        return WeiQuPai.Util.hasCache('item_dislike', id) ? 'selfnolike' : 'nolike';
                    }
                }
            )
        }, {
            xtype: 'container',
            itemId: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="title_new">{title}</div>',
                '<div class="price"><span class="oprice">原价￥{oprice}</span></div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'log_btn',
            style: 'position:relative;z-index:100',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                itemId: 'tab_itemdesc',
                text: '图文详情',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                text: '商品参数',
                action: 'tab_itemparam',
                itemId: 'tab_itemparam'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_commentlist',
                itemId: 'tab_commentlist',
                text: '大家评论'
            }]
        }, {
            xtype: 'itemdesc'
        }, {
            xtype: 'itemparam',
            hidden: true
        }, {
            xtype: 'commentlist',
            hidden: true

        }, {
            xtype: 'inputcomment',
            itemId: 'itemCommentForm',
            docked: 'bottom',
            hidden: true
        }],

        //当前激活的tab button
        activeTab: null

    },


    initialize: function() {
        this.callParent(arguments);

        this.down('#item_title').on('tap', this.bindEvent, this, {
            element: 'element'
        });

        //初始化tab
        this.initTab();
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].getItemId().substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                var tab = me.getActiveTab();
                if (tab == this) return;
                if(this.tabView.isXType('commentlist')){
                    me.down('inputcomment').show();
                }else{
                    me.down('inputcomment').hide();
                }
                tab.removeCls('x-button-active');
                tab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.setActiveTab(this);
                setTimeout(function() {
                    var scroller = me.getScrollable().getScroller();
                    if (scroller.position.y > me.tabPosition) {
                        scroller.scrollTo(null, me.tabPosition, true);
                    }
                }, 50);
            });
        }
        this.setActiveTab(btns[0]);

        //tab的悬停效果
        this.on('painted', function() {
            this.tabPosition = this.down('#tabbar').element.getY() - this.down('vtitlebar').element.getHeight();
        }, this, {
            single: true
        });
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroller, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabbar').translate(null, y - this.tabPosition, false);
            } else {
                this.down('#tabbar').translate(null, 0, false);
            }
        }, this);
        scroller.addListener('scrollend', this.listPaging, this);
    },

    listPaging: function(scroller, x, y) {
        if (y < scroller.maxPosition.y) {
            return;
        }
        var tabView = this.getActiveTab().tabView;
        tabView.nextPage && tabView.nextPage(scroller);
    },

    bindEvent: function(e) {
        if (e.target.className == 'like') {
            this.fireEvent('itemlike', this);
            return false;
        }
        if (e.target.className == 'nolike') {
            this.fireEvent('itemdislike', this);
            return false;
        }
        if (e.target.className == 'selflike') {
            this.fireEvent('cancelitemlike', this);
            return false;
        }
        if (e.target.className == 'selfnolike') {
            this.fireEvent('cancelitemdislike', this);
            return false;
        }
        if (Ext.get(e.target).findParent('.notice_btn1')) {
            this.fireEvent('expectprice', this);
            return false;
        }
        if (Ext.get(e.target).findParent('.notice_btn2')) {
            this.fireEvent('noticetap', this);
            return false;
        }
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

    loadData: function(callback) {
        var item = this.getRecord();
        this.down('commentlist').setItemId(item.get('id'));
        WeiQuPai.model.Item.load(item.get('id'), {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
                Ext.isFunction(callback) && callback();
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
        this.down('commentlist').setItemId(record.get('id'));
        this.down('inputcomment').down('hiddenfield[name=item_id]').setValue(record.get('id'));

        var data = record.data;
        this.down('detailpicshow').setPicData(data.pic_top);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('#price_data').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        return record;
    },

    updateItemStat: function(field, value) {
        var data = this.down('#item_stat').getData();
        data.item_stat[field] = parseInt(data.item_stat[field]) + value;
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
    },
});