Ext.define('WeiQuPai.controller.UserAuction', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            paiBtn: 'userauction button[action=pai]',
            createBtn: 'userauction button[action=create]',
        },
        control: {
            paiBtn: {
                tap: 'showOrderView'
            },
            createBtn: {
                tap: 'createAuction'
            }
        }
    },

    //一拍到底到订单页
    showOrderView: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var currentView = WeiQuPai.navigator.getActiveItem();
        var record = currentView.getRecord();
        var auctionData = currentView.getRecord().get('self_auction');
        if (auctionData.status == WeiQuPai.Config.userAuctionStatus.STATUS_DEAL) {
            WeiQuPai.Util.toast('您的拍卖已成交');
            return;
        }
        if (auctionData.status == WeiQuPai.Config.userAuctionStatus.STATUS_CANCEL) {
            WeiQuPai.Util.toast('由于您长时间未购买，您的拍卖已被系统取消');
            return;
        }
        auctionData.item = {
            id: record.get('id'),
            title: record.get('title'),
            pic_cover: record.get('pic_cover')
        };
        console.log(auctionData);
        auctionData.auction_type = 2;
        var orderView = Ext.create('WeiQuPai.view.Order');
        orderView.setAuctionData(auctionData);
        WeiQuPai.navigator.push(orderView);
    },

    //创建拍卖
    createAuction: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        var record = currentView.getRecord();
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/create';
        data = {
            pool_id: record.get('user_auction').id,
            token: user.token
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            record.set('self_auction', rsp);
            WeiQuPai.Util.toast('拍卖创建成功，赶快分享到朋友圈让好友帮拍吧~');
        });
    },

    //帮拍
    help: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        var record = currentView.getRecord();
        var auctionId = record.get('self_auction').id;
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/help&id=' + auctionId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('您成功帮忙减掉了' + rsp.discount + '元');
        });
    },

    useProp: function(propId) {
        var currentView = WeiQuPai.navigator.getActiveItem();
        var record = currentView.getRecord();
        var auctionId = record.get('self_auction').id;
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/useProp&prop_id=' + propId + '&auction_id=' + auctionId + '&token=' + user.token;
        var msg = [, '您的拍卖被延长2小时', '您的拍卖在2小时内将获得双倍减价的效果'];
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast(msg[propId]);
        });
    }
});