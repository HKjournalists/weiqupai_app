Ext.define('WeiQuPai.view.ShowUserDis', {
    extend: 'Ext.DataView',
    xtype: 'showuserdis',
    config: {
        uid: null,
        cls: 'bg_ef',
        store: 'ShowUserDis',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        itemTpl: new Ext.XTemplate(
            '<div class="mydis">',
            '<div class="dis">',
            '{content}',
            '</div>',
            '<div class="content">',
            '<div class="left">',
            '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 200)]}" width="40">',
            '</div>',
            '<div class="right">',
            '{item.title}',
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
            '{zan_num}',
            '</div>',
            '<div class="bubble">',
            '{reply_num}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>'
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
        this.on('itemtap', function(list, index, dataItem, record, e) {
            if (Ext.get(e.target).findParent('.content')) {
                this.fireEvent('cardtap', this, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'zan') {
                this.fireEvent('zantap', this, index, dataItem, record, e);
                return false;
            }
            this.fireEvent('detailtap', this, index, dataItem, record, e);
        }, this);

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
        store.getProxy().setExtraParam('uid', uid);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
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
    }
});