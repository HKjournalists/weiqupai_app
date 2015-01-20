Ext.define('WeiQuPai.view.ShowUserFeed', {
    extend: 'Ext.DataView',
    xtype: 'showuserfeed',
    config: {
        uid: null,
        store: 'ShowUserFeed',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        cls: 'bg_ef',

        itemTpl: new Ext.XTemplate(
            '<div class="mydis">',
            '<div class="dis">',
            '{content:htmlEncode}',
            '</div>',
            '<tpl if="feed_type==1">',
            '<div class="pic-group-list center"><tpl for="json_data.pic_list"><img src="{[this.getShowOrderPic(values)]}"/></tpl></div>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '<div class="content">',
            '<div class="left">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}" width="40">',
            '</div>',
            '<div class="right">',
            '{json_data.title}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '<div class="time">',
            '<div class="left">',
            '{ctime}',
            '</div>',
            '<div class="right">',
            '<div class="zan">',
            '{reply_num}',
            '</div>',
            '<div class="bubble">',
            '{zan_num}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>', {
                getShowOrderPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, 150);
                },
                getPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, 200);
                },
            }
        ),

        loadMoreCmp: null,
        isFullyLoaded: false
    },

    loadCmpCfg: {
        baseCls: 'x-list-paging',
        html: [
            '<div class="x-loading-spinner" style="font-size: 20px; margin: 0px auto;">',
            '<span class="x-loading-top"></span>',
            '<span class="x-loading-right"></span>',
            '<span class="x-loading-bottom"></span>',
            '<span class="x-loading-left"></span>',
            '</div>'
        ].join('')
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.bindEvent, this);
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);

        var cmp = Ext.create('Ext.Component', this.loadCmpCfg);
        this.setLoadMoreCmp(cmp);
        this.add(this.getLoadMoreCmp());
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid, callback) {
        this.setLoadingText(null);
        var store = this.getStore();
        var query = WeiQuPai.Util.getDefaultParam();
        query['uid'] = uid;
        store.getProxy().setExtraParams(query);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return;
            }
            if (records.length == 0) {
                this.msgbox.show();
            }
            if (records.length < store.getPageSize()) {
                this.setIsFullyLoaded(true);
                this.getLoadMoreCmp().hide();
            } else {
                this.setIsFullyLoaded(false);
            }
            Ext.isFunction(callback) && callback();
        }, this);
    },

    nextPage: function(scroller) {
        var store = this.getStore();
        if (store.isLoading() || this.getIsFullyLoaded()) {
            return;
        }
        var loadCmp = this.getLoadMoreCmp();
        loadCmp.addCls('x-loading');
        loadCmp.show();

        store.nextPage({
            addRecords: true,
            scope: this,
            callback: function(records, operation, success) {
                loadCmp.removeCls('x-loading');
                if (records.length < store.getPageSize()) {
                    this.setIsFullyLoaded(true);
                    scroller.on({
                        scrollend: function() {
                            loadCmp.hide();
                            scroller.refresh();
                        },
                        single: true
                    });
                    var offset = -loadCmp.element.getHeight();
                    scroller.scrollBy(null, offset, {
                        duration: 300
                    });
                }
                if (!success) {
                    return WeiQuPai.Util.toast('数据加载失败');
                }
            }
        })
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.content')) {
            this.fireEvent('cardtap', this, index, dataItem, record, e);
            return false;
        }
        if (Ext.get(e.target).findParent('.img')) {
            this.fireEvent('pictap', this, index, dataItem, record, e);
            return false;
        }
        if (e.target.className == 'bubble') {
            this.fireEvent('zantap', this, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('detailtap', this, index, dataItem, record, e);
    }
});