Ext.define('WeiQuPai.view.ShowUserFeed', {
    extend: 'Ext.DataView',
    xtype: 'showuserfeed',
    config: {
        uid: null,
        store: 'ShowUserFeed',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        cls: 'bg_ef',

        itemTpl: new Ext.XTemplate(
            '<div class="mydis">',
            '<div class="dis">',
            '{content:htmlEncode}',
            '</div>',
            '<tpl if="feed_type==1">',
            '<div class="img"><tpl for="json_data.pic_list"><img src="{[this.getPic(values)]}"/></tpl></div>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '<div class="content">',
            '<div class="left">',
            '<img src="{[WeiQuPai.Util.getImagePath(values.json_data.pic_cover, 100)]}" width="30">',
            '</div>',
            '<div class="right">',
            '{json_data.title}',
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
            '{reply_num}',
            '</div>',
            '<div class="bubble">',
            '{zan_num}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>', {
                getPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, '100');
                }
            }
        )


    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', function(list, index, dataItem, record, e) {
            if (Ext.get(e.target).findParent('.content')) {
                this.fireEvent('cardtap', this, index, dataItem, record, e);
                return false;
            }
            if (Ext.get(e.target).findParent('.img')) {
                this.fireEvent('pictap', this, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'bubble') {
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