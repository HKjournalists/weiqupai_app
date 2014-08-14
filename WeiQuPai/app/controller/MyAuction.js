Ext.define('WeiQuPai.controller.MyAuction', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'myauction',
        },
        control: {
            pageView: {
                itemtap: 'showDetail',
                order_item: 'goOrder',
                itemdetail: 'showItem'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    //显示商品详情
    showItem: function(list, index, dataItem, record, e) {
        var itemId = record.get('item_id');
        WeiQuPai.Util.goItemView(itemId);
    },

    goOrder: function(list, index, dataItem, record, e) {
        var id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/view&basic=1&id=' + id;
        WeiQuPai.Util.get(url, function(rsp) {
            rsp.auction_type = 2;
            var view = Ext.create('WeiQuPai.view.Order');
            view.setAuctionData(rsp);
            WeiQuPai.navigator.push(view);
        });
    }

});