Ext.define('WeiQuPai.view.CommentList', {
    extend: 'Ext.DataView',
    xtype: 'commentlist',
    requires: ['WeiQuPai.view.Comment'],
    config: {
        itemId: null,
        scrollable: null,
        store: 'Comment',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        cls: 'discard',
        itemTpl: new Ext.XTemplate(
            '<div class="list" data-id="{id}">',
            '<div class="one">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.user.avatar, 80)]}" width="40">',
            '</div>',
            '<div class="name">{user.nick:htmlEncode}</div>',
            '</div>',
            '<div class="dis">{content:htmlEncode}</div>',
            '<div class="date">',
            '<div class="left">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
            '<div class="right">',
            '<div class="comment">{reply_num}</div>',
            '<div class="{[this.getZanCls(values)]}">{zan_num}</div>',
            '</div>',
            '</div>',
            '</div>', {
                getZanCls: function(values) {
                    var id = parseInt(values.id);
                    return WeiQuPai.Util.hasCache('comment_zan', id) ? 'selflike' : 'like';
                },
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                }
            }
        ),
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                flex: 1
            }, {
                xtype: 'spacer',
                cls: 'detail_listOne',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]
    },

    //没有内容的占位容器
    msgbox: null,

    initialize: function() {
        this.callParent();
        this.msgbox = WeiQuPai.Util.msgbox('还没有人评论该商品.');
        this.add(this.msgbox);
        //默认的itemtap在android下不能弹出keyboard，又是曲线救国
        this.handleItemTap();
    },

    handleItemTap: function() {
        var me = this;
        this.element.dom.addEventListener('click', function(e) {
            var row = Ext.fly(e.target).findParent('.list');
            if (!row) return;
            var id = row.getAttribute('data-id');
            var index = me.getStore().indexOfId(id);
            var record = me.getStore().getAt(index);
            if (e.target.tagName.toLowerCase() == 'img') {
                me.fireEvent('avatartap', index, record);
                return false;
            }
            if (e.target.className == 'like') {
                me.fireEvent('zantap', index, record);
                return false;
            }
            if (e.target.className == 'selflike') {
                me.fireEvent('cancelzantap', index, record);
                return false;
            }
            if (e.target.className == 'delete-post-btn') {
                me.fireEvent('deletepost', me, index, record);
                return false;
            }
            me.fireEvent('commenttap', index, record);
        });
    },

    applyItemId: function(itemId) {
        this.loadData(itemId);
    },

    loadData: function(itemId) {
        var store = this.getStore();
        //先清一下数据，防止别的商品的评论先出现
        store.getProxy().setExtraParam('item_id', itemId);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('评论加载失败');
                return;
            }
            if (records.length == 0) {
                this.msgbox.show();
            }
        }, this);
    }

});