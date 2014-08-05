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
            '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 100)]}" width="30">',
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
        this.on('itemtap', function(list, index, dataItem, record, e) {
            if (Ext.get(e.target).findParent('.content')) {
                this.fireEvent('cardtap', this, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'zan') {
                this.fireEvent('zantap', this, index, dataItem, record, e);
                return false;
            }
            this.fireEvent('detailtap', this, index, dataItem, record, e);
        }, this);
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid) {
        var store = this.getStore();
        store.removeAll();
        store.getProxy().setExtraParam('uid', uid);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    }

});