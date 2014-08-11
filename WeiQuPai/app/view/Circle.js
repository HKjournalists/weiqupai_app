/**
 * 拍圈的view
 */
Ext.define('WeiQuPai.view.Circle', {
    extend: 'Ext.DataView',
    requires: ['WeiQuPai.view.CircleReplyLayer', 'WeiQuPai.view.Feed'],
    xtype: 'circle',
    config: {
        cls: 'bg_ef discard remess paiquan',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
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
        store: 'Circle',
        itemTpl: new Ext.XTemplate(
            '<div class="list circle-row" data-id="{id}">',
            '<div class="one">',
            '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="40"></div>',
            '<div class="name">',
            '<tpl if="feed_type==0">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 发表了一条消息</span></div>',
            '<div class="feed-content">{content:htmlEncode}</div>',

            '<tpl elseif="feed_type==1">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 发表了一个晒单</span></div>',
            '<div class="color_38">{content:htmlEncode}</div>',
            '<div class="pic-group-list"><tpl for="json_data.pic_list"><img src="{[this.getShowOrderPic(values)]}" data-idx="{#}" class="pic-list-img"/></tpl></div>',
            '<div class="confirm_w"><div class="confirm_title">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
            '<div class="title">{json_data.title}</div>',
            '<div style="clear:both"></div>',
            '</div></div>',

            '<tpl elseif="feed_type==2">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 拍下了一个宝贝</span></div>',
            '<div class="feed-content">{content:htmlEncode}</div>',
            '<div class="confirm_w"><div class="confirm_title">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
            '<div class="title">{json_data.title}</div>',
            '<div style="clear:both"></div>',
            '</div></div>',
            '</tpl>',


            '<div class="date">',
            '<div class="left">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
            '<div class="right">',
            '<div class="comment">{reply_num}</div>',
            '<div class="{[this.getZanCls(values)]}">{zan_num}</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>',

            '</div>',
            '</div>',
            '</div>', {
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                },
                getZanCls: function(values) {
                    return WeiQuPai.Util.hasCache('circle_zan', values.id) ? 'selflike' : 'like';
                },
                getPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, 100);
                },
                getShowOrderPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic);
                },
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '拍圈',
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
        this.on('activate', this.onActivate, this);
        this.handleItemTap();
    },

    onActivate: function() {
        var msgType = [WeiQuPai.Notify.MSG_CIRCLE, WeiQuPai.Notify.MSG_CIRCLE_REPLY, WeiQuPai.Notify.MSG_CIRCLE_ZAN];
        //有新消息才刷新
        if (WeiQuPai.Notify.hasNotify(msgType)) {
            this.loadData();
            WeiQuPai.Notify.clearNotify(msgType);
        }
    },

    loadData: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        this.getStore().getProxy().setExtraParam('token', user && user.token || null);
        this.setLoadingText(null);
        this.getStore().load();
    },

    handleItemTap: function() {
        if (Ext.os.is.ios) {
            this.on('itemtap', function(list, index, dataItem, record, e) {
                this.bindEvent(index, record, e);
            });
        } else {
            var me = this;
            this.element.dom.addEventListener('click', function(e) {
                var row = Ext.fly(e.target).up('.circle-row');
                if (!row) return;
                var id = row.getAttribute('data-id');
                var index = me.getStore().indexOfId(id);
                var record = me.getStore().getAt(index);
                me.bindEvent(index, record, e);
            });
        }
    },

    bindEvent: function(index, record, e) {
        var me = this;
        var user = WeiQuPai.Cache.get('currentUser');
        if (Ext.get(e.target).findParent('.avatar')) {
            me.fireEvent('avatartap', me, index, record);
            return false;
        }

        //卡片点击
        var card = Ext.get(e.target).findParent('.confirm_title');
        if (card) {
            me.fireEvent('cardtap', me, index, record);
            return false;
        }

        if (e.target.className == 'delete-post-btn') {
            me.fireEvent('deletepost', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.like')) {
            me.fireEvent('zan', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.selflike')) {
            me.fireEvent('cancelzan', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.pic-list-img')) {
            var picIdx = e.target.getAttribute('data-idx');
            me.fireEvent('pictap', me, index, record, picIdx);
            return false;
        }
        me.fireEvent('feedtap', me, index, record);
    }
});