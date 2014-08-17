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
                '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 100)]}" width="100" itemid="{item_id}" class="notice_t imgbase" >',
                '</div>',
                '</div>',
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
        if (e.target.className == 'notice_t') {
            var toUid = e.target.getAttribute('itemid');
            this.fireEvent('cardtap', this, e.target.getAttribute('itemid'));
            return false;
        }
    }
})