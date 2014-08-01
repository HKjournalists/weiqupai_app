Ext.define('WeiQuPai.view.Comment', {
    extend: 'Ext.DataView',
    xtype: 'comment',
    config: {
        itemId: null,
        scrollable: null,
        store: 'Comment',
        loadingText: null,
        disableSelection: true,
        pressedCls: '',
        cls: 'discard',
        itemTpl: new Ext.XTemplate(
            '<div class="list" data-id="{id}">',
            '<div class="one">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 80)]}" width="40">',
            '</div>',
            '<div class="name">{nick:htmlEncode}</div>',
            '</div>',
            '<div class="dis">{content:htmlEncode}</div>',
            '<div class="date">',
            '<div class="left">{ctime}</div>',
            '<div class="right">',
            '<div class="like">{up_num}</div>',
            '<div class="comment">{reply_num}</div>',
            '</div>',
            '</div>',
            '</div>'
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
            var row = Ext.fly(e.target).up('.list');
            if (!row) return;
            var id = row.getAttribute('data-id');
            var index = me.getStore().indexOfId(id);
            var record = me.getStore().getAt(index);
            if (e.target.tagName.toLowerCase() == 'img') {
                me.fireEvent('avatartap', index, record);
                return false;
            }
            if (e.target.className == 'like') {
                me.fireEvent('uptap', index, record);
                return false;
            }
            if (e.target.className == 'comment') {
                me.fireEvent('commenttap', index, record);
                return false;
            }
        });
    },

    applyItemId: function(itemId) {
        this.loadData(itemId);
    },

    loadData: function(itemId) {
        var store = this.getStore();
        //先清一下数据，防止别的商品的评论先出现
        store.removeAll();
        store.getProxy().setExtraParam('id', itemId);
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