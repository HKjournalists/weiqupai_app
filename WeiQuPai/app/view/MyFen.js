Ext.define('WeiQuPai.view.MyFen', {
    extend: 'Ext.DataView',
    xtype: 'myfen',
    config: {
        uid: null,
        loadingText: null,
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef myfen',
        store: 'MyFans',
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
        itemTpl: new Ext.XTemplate(
            '<div class="myfollow" >',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="40">',
            '</div>',
            '<div class="name">{nick}</div>',
            '</div>'
        ),
        items: [{
            xtype: 'vtitlebar',
            title: 'TA的粉丝',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
    },

    applyUid: function(uid) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (user && user.id == uid) {
            this.down('vtitlebar').setTitle('我的粉丝');
        }
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid) {
        var user = WeiQuPai.Cache.get('currentUser');
        this.setLoadingText(null);
        var store = this.getStore();
        store.getProxy().setExtraParam('uid', uid);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
    }
})