Ext.define('WeiQuPai.view.SearchUser', {
    extend: 'Ext.DataView',
    xtype: 'searchuser',
    config: {
        word: '',
        loadingText: null,
        disableSelection: true,
        cls: 'bg_ef',
        store: 'SearchUser',
        plugins: [{
            type: 'wlistpaging',
        }],
        itemCls: 'fans_list',
        itemTpl: new Ext.XTemplate(
            '<div class="myfen">',
            '<tpl if="followed">',
            '<input type="button" class="btn j-cancel" value="取消关注" />',
            '<tpl else>',
            '<input type="button" class="btn j-follow" value="+关注" />',
            '</tpl>',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="40">',
            '</div>',
            '<div class="name">',
            '<div>{nick}</div>',
            '<div class="des">{sign}</div>',
            '</div>',
            '<div class="clear"></div>',
            '</div>'
        )
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.bindEvent, this);

        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        this.getStore().on('load', WeiQuPai.Util.onStoreLoad, this);
        this.getStore().on('latestfetched', WeiQuPai.Util.onStoreLoad, this);

        WeiQuPai.app.on('addfollow', this.addFollow, this);
        WeiQuPai.app.on('cancelfollow', this.cancelFollow, this);
    },

    loadData: function(callback) {
        var word = this.getWord();
        if(!word){
            return;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var store = this.getStore();
        store.removeAll();
        this.getPlugins()[0].setIsFullyLoaded(false);
        this.getScrollable().getScroller().scrollToTop(false);
        this.setLoadingText(null);
        store.getProxy().setExtraParam('word', word);
        store.getProxy().setExtraParam('token', user.token);
        store.loadPage(1, function(records, operation, success) {
            Ext.isFunction(callback) && callback();
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.j-cancel')) {
            this.fireEvent('cancelfollow', this, index, dataItem, record, e);
            return false;
        }
        if (Ext.get(e.target).findParent('.j-follow')) {
            this.fireEvent('follow', this, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('showdetail', this, index, dataItem, record, e);
    },

    addFollow: function(uid){
        var record = this.getStore().getById(uid);
        record && record.set('followed', true);
    },

    cancelFollow: function(uid){
        var record = this.getStore().getById(uid);
        record && record.set('followed', false);
    }
})