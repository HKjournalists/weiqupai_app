Ext.define('WeiQuPai.view.UserAuctionComment', {
    extend: 'Ext.DataView',
    xtype: 'userauctioncomment',
    config: {
        cls: 'feed discard remess',
        loadingText: null,
        scrollToTopOnRefresh: false,
        store: 'UserAuctionComment',
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
            type: 'wlistpaging',
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="list" data-id="{id}">',
            '<div class="one">',
            '<div class="img"><img src="{[WeiQuPai.Util.getAvatar(values.user.avatar, 140)]}" width="40"></div>',
            '<div class="name">{user.nick:htmlEncode}<div class="dis">{content:htmlEncode}</div></div>',
            '</div>',
            '<div class="date">',
            '<div class="left">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
            '</div>',
            '</div>', {
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '战况评论',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'inputcomment',
            itemId: 'post',
            docked: 'bottom'
        }],

        auctionId: null
    },

    msgbox: null,

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        this.on('itemtap', this.bindEvent, this);
    },

    updateAuctionId: function(id) {
        this.loadData();
    },

    loadData: function() {
        if (this.getStore().isLoading()) {
            return false;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var store = this.getStore();
        var query = WeiQuPai.Util.getDefaultParam();
        query['auction_id'] = this.getAuctionId();
        store.getProxy().setExtraParams(query);
        this.setLoadingText(null);
        store.on('load', WeiQuPai.Util.onStoreLoad, this);
        store.loadPage(1);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (e.target.className == 'delete-post-btn') {
            this.fireEvent('deletemsg', list, index, record);
            return false;
        }
        if (e.target.tagName.toLowerCase() == 'img') {
            this.fireEvent('avatartap', list, index, record);
            return false;
        }
    }
})