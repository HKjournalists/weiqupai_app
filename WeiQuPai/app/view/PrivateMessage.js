Ext.define('WeiQuPai.view.PrivateMessage', {
    extend: 'Ext.DataView',
    xtype: 'privatemessage',
    rqeuires: ['WeiQuPai.view.Comment', 'WeiQuPai.view.Feed'],
    config: {
        uid: null,
        listHeight: null,
        cls: 'bg_ef',
        loadingText: null,
        scrollToTopOnRefresh: false,
        store: 'PrivateMessage',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉加载历史记录',
            releaseText: '释放立即加载',
            loadedText: '下拉加载历史记录',
            refreshFn: 'fetchLastest',
            scrollerAutoRefresh: true
        }],
        itemCls: 'pm-dataitem',
        itemTpl: new Ext.XTemplate(
            '<tpl if="!this.isMine(values)">',
            '<div class="letterMy">',
            '<div class="img"><img src="{[this.getAvatar(values.sender.avatar)]}" width="30"></div>',
            '<div class="letterleft"></div>',
            '<div class="letter">{content.content:htmlEncode}</div>',
            '</div>',
            '<div style="clear:both"></div>',
            '<tpl else>',
            '<div class="letterYou">',
            '<div class="img"><img src="{[this.getAvatar(values.sender.avatar)]}" width="30"></div>',
            '<div class="letterright"></div>',
            '<div class="letter">{content.content:htmlEncode}</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</tpl>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                },
                isMine: function(values) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    return values.sender.id == user.id;
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '消息详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            docked: 'bottom',
            xtype: 'container',
            layout: {
                'type': 'hbox',
                'align': 'center'
            },
            items: [{
                xtype: 'textfield',
                name: 'content',
                baseCls: 'input_text',
                clearIcon: false,
                flex: 1
            }, {
                xtype: 'button',
                baseCls: 'btn_e7',
                cls: 'send_btn',
                action: 'sendmsg',
                text: '发送',
                disabled: true,
                style: 'margin-right:10px;'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.down('textfield').on('keyup', this.changeButtonState, this);
        this.down('button[action=sendmsg]').on('tap', function() {
            this.fireEvent('sendmsg', this);
        }, this);
    },

    changeButtonState: function() {
        var value = this.down('textfield').getValue();
        this.down('button[action=sendmsg]').setDisabled(value.length == 0);
    },

    updateUid: function(uid) {
        this.loadData();
    },

    fetchLastest: function() {
        var me = this;
        var list = this.getList();
        store = list.getStore();
        var nextPage = ++store.currentPage;
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/message/pm&sender=' + list.getUid() + '&page=' + nextPage + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            if (rsp.length == 0) {
                me.setState('loaded');
                return me.snapBack();
            }
            me.setState('pull');
            var toInsert = [];
            var oldRecord;
            for (var i = 0; i < rsp.length; i++) {
                oldRecord = store.getById(rsp[i].id);
                !oldRecord && toInsert.push(rsp[i]);
            }
            store.insert(0, toInsert);
            var offset = list.getListHeight();
            var scroller = list.getScrollable().getScroller();
            scroller.refresh();
            scroller.minPosition.y = 0;
            scroller.scrollBy(0, offset);
        });
    },

    loadData: function() {
        var uid = this.getUid();
        var user = WeiQuPai.Cache.get('currentUser');
        this.getStore().getProxy().setExtraParam('token', user && user.token || null);
        this.getStore().getProxy().setExtraParam('sender', uid);
        this.setLoadingText(null);
        this.getStore().loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败 ');
            }
            var me = this;
            setTimeout(function() {
                me.setListHeight(me.getScrollable().getScroller().getContainerSize().y);
                me.getScrollable().getScroller().scrollToEnd(true);
            }, 200);
        }, this);
    }
})