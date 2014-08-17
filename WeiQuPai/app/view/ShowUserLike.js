Ext.define('WeiQuPai.view.ShowUserLike', {
    extend: 'Ext.DataView',
    xtype: 'showuserlike',
    config: {
        uid: null,
        cls: 'mylike',
        store: 'ShowUserLike',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        itemTpl: new Ext.XTemplate(
            '<div class="myProduct">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getImagePath(values.pic_cover, 100)]}" class="imgbase" width="100">',
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
        this.onBefore('itemtap', this.bindEvent, this);
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

    loadData: function(uid) {
        var store = this.getStore();
        this.setLoadingText(null);
        store.getProxy().setExtraParam('uid', uid);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
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
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        var me = this;
        if (e.target.className == 'img') {
            me.fireEvent('liketap', me, index, dataItem, record, e);
            return false;
        }
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
})