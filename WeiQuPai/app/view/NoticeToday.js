Ext.define('WeiQuPai.view.NoticeToday', {
    extend: 'Ext.DataView',
    xtype: 'noticetoday',
    config: {
        uid: null,
        cls: 'mylike',
        loadingText: null,
        disableSelection: true,
        scrollable: null,
        items: [{
            xtype: 'container',
            itemId: 'notice',
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
        this.down("#notice").on('tap', this.bindEvent, this, {
            element: 'element',
        });
    },

    loadData: function(callback) {
        var person = this.down('#notice');
        var url = WeiQuPai.Util.apiUrl('r=appv2/auctionNotice&day=1');
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