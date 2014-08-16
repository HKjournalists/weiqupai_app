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
            '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 200)]}" width="40">',
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
            '{zan_num}',
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

        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
    },

    applyUid: function(uid) {
        this.loadData(uid);
        return uid;
    },

    loadData: function(uid) {
        this.setLoadingText(null);
        var store = this.getStore();
        store.getProxy().setExtraParam('uid', uid);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if (records.length == 0) {
                this.msgbox.show();
            }
        });
    }

});