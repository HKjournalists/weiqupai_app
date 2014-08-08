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
                '<div class="yugao"><div class="title">13:00</div></div>',
                '<tpl for=".">',
                '<div class="myProduct">',
                '<div class="img">',
                '<img src="{item.pic_cover}" width="100">',
                '</div>',
                '</div>',
                '</tpl>',
                '<div style="clear:both"></div>'
            )
        }]
    },

    initialize: function() {
        this.loadData();
        this.down("#noticeafter").on('tap', this.bindEvent, this, {
            element: 'element',
        });
    },

    loadData: function(uid, callback) {
        var person = this.down('#noticeafter');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionNotice&day=' + 3;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            person.setData(rsp);
            Ext.isFunction(callback) && callback();
        });
    },

    bindEvent: function(e) {
        var me = this;
        // console.log(record + "+" + e + "+" + dataItem);
        if (Ext.get(e.target).findParent('.myProduct')) {
            me.fireEvent('cardtap', me, e);
            return false;
        }
    }
})