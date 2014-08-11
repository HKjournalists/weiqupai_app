Ext.define('WeiQuPai.view.MyMessage', {
    extend: 'Ext.DataView',
    xtype: 'mymessage',
    rqeuires: ['WeiQuPai.view.Comment', 'WeiQuPai.view.Feed'],
    config: {
        cls: 'bg_ef message',
        loadingText: null,
        scrollToTopOnRefresh: false,
        store: 'MyMessage',
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
            '<div class="list">',
            '<div class="one">',
            '<div class="img">',
            '<img src="{[this.getAvatar(values.sender.avatar)]}" width="40">',
            '</div>',
            '<div class="name">{content.content:htmlEncode}</div>',
            '<div style="clear:both"></div>',
            '</div>',

            '<div class="time">',
            '<div class="left">{ctime} <span class="delete-post-btn">删除</span></div>',
            '<div class="right">',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '我的消息',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.loadData();
        this.on('itemtap', this.bindEvent, this);
    },

    loadData: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        this.getStore().getProxy().setExtraParam('token', user && user.token || null);
        this.setLoadingText(null);
        this.getStore().load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (e.target.className == 'delete-post-btn') {
            this.fireEvent('deletemsg', list, index, record);
            return false;
        }
        this.fireEvent('viewdetail', list, index, record);
    }
})