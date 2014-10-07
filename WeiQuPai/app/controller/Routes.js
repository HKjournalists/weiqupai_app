Ext.define('WeiQuPai.controller.Routes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main'
        },

        routes: {
            'item/:id': 'showItem',
            'user/:id': 'showUser',
            'orderinfo/:id': 'showOrderDetail',
            'order/:auctionId' : 'showSubmitOrder',
            'userAuction/:id': 'showUserAuction',
            'login': 'showLogin',
            'register': 'showRegister',
            'killend': 'showKillEnd',
            'special/:id': 'showSpecial',
            'share': 'share',
            'view/:name' : 'showView',
            'tab/:name' : 'showTab',
            'scoreInfo' : 'showScoreInfo',
            'feed/:id': 'showFeed',
            'comment/:id': 'showComment'
        }
    },

    showLogin: function() {
        WeiQuPai.navigator.push(Ext.create('WeiQuPai.view.Login'));
    },

    showRegister: function() {
        WeiQuPai.navigator.push(Ext.create('WeiQuPai.view.Register'));
    },

    showItem: function(id) {
        WeiQuPai.Util.goItemView(id);
    },

    showUser: function(id){
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(id);
        WeiQuPai.navigator.push(view);
    },

    showSubmitOrder: function(auctionId){
        WeiQuPai.app.getController('Auction').showOrderView(auctionId);
    },

    showScoreInfo: function(){
        WeiQuPai.app.getController('KillEnd').showScore();
    },

    showOrderDetail: function(id){
        var view = Ext.create('WeiQuPai.view.MyOrderDetail');
        view.setOrderId(id);
        WeiQuPai.navigator.push(view);
    },

    showUserAuction: function(id) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(id);
        WeiQuPai.navigator.push(view);
    },

    showKillEnd: function(){
        var view = Ext.create('WeiQuPai.view.KillEnd');
        WeiQuPai.navigator.push(view);
    },

    showSpecial: function(id){
        var param ={
            id: id,
            title: '拍卖专场'
        }
        var view = Ext.create('WeiQuPai.view.SpecialSale', param);
        WeiQuPai.navigator.push(view);
    },

    showView: function(name){
        var view = Ext.createByAlias('widget.' + name);
        WeiQuPai.navigator.push(view);
    },

    showTab: function(name){
        WeiQuPai.navigator.pop('maincard');
        WeiQuPai.sidebar.activeTabItem(name);
    },

    showFeed: function(id){
        var feedView = Ext.create('WeiQuPai.view.Feed');
        feedView.setFeedId(id);
        WeiQuPai.navigator.push(feedView);
    },

    showComment: function(id){
        var view = Ext.create('WeiQuPai.view.Comment');
        view.setCommentId(id);
        WeiQuPai.navigator.push(view);
    },

    share: function(data) {
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        layer.down('button[action=weibo]').setDisabled(false);
        layer.setShareData(data);
        layer.show();
    }
});