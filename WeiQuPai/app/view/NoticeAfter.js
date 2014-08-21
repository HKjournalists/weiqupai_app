Ext.define('WeiQuPai.view.NoticeAfter', {
    extend: 'Ext.DataView',
    xtype: 'noticeafter',
    config: {
        uid: null,
        cls: 'mylike',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        items: [{
            xtype: 'container',
            id: 'noticeafter',
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="yugao"><div class="title">{time}</div></div>',
                '<div class="detailDatabot">',
                '<tpl for="items">',
                '<div class="myProduct" item_id="{item_id}">',
                '<div class="img" style="background-image:url({[WeiQuPai.Util.getImagePath(values.item.pic_cover, 200)]})">',
                '</div>',
                '</div>',
                '</tpl>',
                '<div style="clear:both"></div>',
                '</div>',
                '</tpl>'
            )
        }]
    },

    initialize: function() {
        this.loadData();
        this.down("#noticeafter").on('tap', this.bindEvent, this, {
            element: 'element',
        });
    },

    loadData: function(callback) {
        var person = this.down('#noticeafter');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionNotice&day=' + 3;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            person.setData(rsp);
            Ext.isFunction(callback) && callback();
        });
    },

    bindEvent: function(e) {
        var item = Ext.get(e.target).findParent('.myProduct');
        if (item) {
            var itemId = item.getAttribute('item_id');
            WeiQuPai.Util.goItemView(itemId);
            return false;
        }
    }
})