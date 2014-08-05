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
        this.callParent(arguments);
        var me = this;
        this.onBefore('itemtap', function(list, index, dataItem, record, e) {
            if (e.target.className == 'content') {
                me.fireEvent('protap', me, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'dis') {
                me.fireEvent('detailtap', me, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'bubble') {
                me.fireEvent('detailtap1', me, index, dataItem, record, e);
                return false;
            }
        }, this);
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid) {
        var store = this.getStore();
        store.getProxy().setExtraParam('uid', uid);
        store.load();
    }

});