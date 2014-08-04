Ext.define('WeiQuPai.view.ShowUserDis', {
    extend: 'Ext.DataView',
    xtype: 'showuserdis',
    config: {
        uid: null,
        cls: 'bg_ef',
        store: 'ShowUserDis',
        loadingText: null,
        disableSelection: true,
        scrollable: null,

        itemTpl: new Ext.XTemplate(
            '<div class="mydis">',
            '<div class="dis">',
            '{content}',
            '</div>',
            '<div class="content">',
            '<div class="left">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.item.pic_cover, 140)]}" width="30">',
            '</div>',
            '<div class="right">',
            '{item.title}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '<div class="time">',
            '<div class="left">',
            '{ctime}',
            '</div>',
            '<div class="right">',
            '<div class="zan">',
            '{up_num}',
            '</div>',
            '<div class="bubble">',
            '{reply_num}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>'
        )

    },

    initialize: function() {
        // this.onBefore('itemtap', this.bindEvent, this);
        this.callParent(arguments);
        this.onBefore('itemtap', this.bindEvent, this, {
            element: 'element'
        });
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid) {
        var store = this.getStore();
        store.getProxy().setExtraParam('uid', uid);
        store.load();
    },

    bindEvent: function(list, index, dataItem, record, e) {
        var me = this;
        if (e.target.className == 'img') {
            me.fireEvent('liketap', me, index, dataItem, record, e);
            return false;
        }
    },


});