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
                '<div class="detailDatabot">',
                '<div class="yugao"><div class="title">{time}</div></div>',
                '<tpl for="items">',
                '<div class="myProduct">',
                '<div class="img">',
                '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 200)]}" width="100" item_id="{item_id}" class="notice_t imgbase">',
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionNotice&day=' + 1;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            person.setData(rsp);
            Ext.isFunction(callback) && callback();
        });
    },

    bindEvent: function(e) {
        if (Ext.get(e.target).hasCls('notice_t')) {
            var itemId = e.target.getAttribute('item_id');
            WeiQuPai.Util.goItemView(itemId);
            return false;
        }
    }
})