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
                '<div>',
                '<div class="yugao"><div class="title">{time}</div></div>',
                '<tpl for="items">',
                '<img src="{item.pic_cover}" width="100" class="myProduct" itemid="{item_id}">',
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

    loadData: function(uid, callback) {
        var person = this.down('#notice');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionNotice&day=' + 1;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
           console.log(rsp);
            person.setData(rsp);
            Ext.isFunction(callback) && callback();
        });
    },

    bindEvent: function(e) {
         if (e.target.className == 'myProduct') {
                var toUid = e.target.getAttribute('itemid');
                console.log(toUid+"+"+e.target.getAttribute('itemid'));
                this.fireEvent('cardtap', this, e.target.getAttribute('itemid'));
                return false;
            }
    }
})