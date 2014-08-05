Ext.define('WeiQuPai.view.ShowUserLike', {
    extend: 'Ext.DataView',
    xtype: 'showuserlike',
    requires: ['WeiQuPai.view.ItemDetail'],
    config: {
        uid: null,
        cls: 'mylike',
        store: 'ShowUserLike',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        itemTpl: new Ext.XTemplate(
            '<div class="myProduct">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.pic_cover)]}" width="100">',
            '</div>',
            '</div>'

        )
    },

    initialize: function() {
        // this.onBefore('itemtap', this.bindEvent, this);
        this.callParent(arguments);
        this.onBefore('itemtap', this.bindEvent, this);
    },

    applyUid: function(uid) {
        this.loadData(uid);
        // console.log("showlike+" + uid);
        //this.down('itemdetail').setUid(uid);
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



})