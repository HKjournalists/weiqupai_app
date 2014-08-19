Ext.define('WeiQuPai.controller.Routes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main'
        },

        routes: {
            'item/:id': 'showItem',
            'userAuction/:id': 'showUserAuction',
            'login': 'showLogin',
            'register': 'showRegister'
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

    showUserAuction: function(id) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(id);
        WeiQuPai.navigator.push(view);
    },

    share: function(data) {
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        layer.down('button[action=weibo]').setDisabled(false);
        layer.setShareData(data);
        layer.show();
    }
});