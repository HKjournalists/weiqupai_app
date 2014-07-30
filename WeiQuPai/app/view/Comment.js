Ext.define('WeiQuPai.view.Comment', {
    extend: 'Ext.DataView',
    xtype: 'comment',
    config: {
        auctionId: null,
        scrollable: null,
        store: 'AuctionComment',
        loadingText: null,
        disableSelection: true,
        pressedCls: '',
        cls: 'discard',
        itemTpl: new Ext.XTemplate(
            '<div class="list">',
            '<div class="one">',
            '<div class="img">',
            '<img src="{[this.getAvatar(values.avatar)]}" width="40">',
            '</div>',
            '<div class="name">',
            '{nick:htmlEncode}',
            '</div>',
            '</div>',
            '<div class="dis">',
            '{content:htmlEncode}',
            '</div>',
            '<div class="date">',
            '<div class="left">',
            '{ctime}',
            '</div>',
            '<div class="right">',
            '<div class="like">',
            '{up_num}',
            '</div>',
            '<div class="comment">',
            '{reply_num}',
            '</div>',
            '</div>',
            '</div>',
            '</div>', {
                getAvatar: function(avatar) {
                    if (avatar) {
                        return WeiQuPai.Util.getImagePath(avatar, '140');
                    }
                    return 'resources/image/default_avatar.jpg';
                }
            }
        ),
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                cls: 'detail_listOne',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]

    },

    applyAuctionId: function(auctionId) {
        this.loadData(auctionId);
    },

    loadData: function(auctionId) {
        var store = this.getStore();
        //先清一下数据，防止别的商品的评论先出现
        store.removeAll();
        store.getProxy().setExtraParam('auction_id', auctionId);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('评论加载失败');
                return;
            }
        }, this);
    }

});