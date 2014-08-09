Ext.define('WeiQuPai.controller.UserAuction', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            paiBtn: 'userauction button[action=pai]',
        },
        control: {
            paiBtn: {
                tap: 'showOrderView'
            }
        }
    },

    //一拍到底到订单页
    showOrderView: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var currentView = WeiQuPai.navigator.getActiveItem();
        var record = currentView.getRecord();
        var auctionData = currentView.getRecord().get('userAuction');
        aucitonData.item = {
            id: record.get('id'),
            title: record.get('title'),
            pic_cover: record.get('pic_cover')
        };
        auctionData.auction_type = 2;
        var orderView = Ext.create('WeiQuPai.view.Order');
        orderView.setAuctionData(auctionData);
        WeiQuPai.navigator.push(orderView);
    }

});