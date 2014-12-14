Ext.define('WeiQuPai.view.HisFans', {
    extend: 'Ext.DataView',
    xtype: 'hisfans',
    config: {
        uid: null,
        loadingText: null,
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef',
        store: 'HisFans',
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
        itemCls: 'fans_list',
        itemTpl: new Ext.XTemplate(
            '<div class="myfen">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="40">',
            '</div>',
            '<div class="name">',
            '<div>{nick}</div>',
            '<div class="des">{sign}</div>',
            '</div>',
            '<div class="clear"></div>',
            '</div>'
        ),
        items: [{
            xtype: 'vtitlebar',
            title: 'TA的粉丝',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.doItemTap, this);
    },

    updateUid: function(uid){
        this.loadData();
    },

    loadData: function() {
        var uid = this.getUid();
        this.setLoadingText(null);
        var store = this.getStore();
        store.getProxy().setExtraParam('uid', uid);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
    },

    doItemTap: function(list, index, dataItem, record, e) {
        WeiQuPai.User.show(record.get('id'));
    }
})