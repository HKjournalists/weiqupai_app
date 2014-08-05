Ext.define('WeiQuPai.controller.Routes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main'
        },

        routes: {
            'item/:id': 'showItem',
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

    showAuction: function(id) {
        WeiQuPai.Util.goItemView(id);
    },

    share: function(data) {
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer', {
            height: 160
        });
        layer.setShareData(data);
        layer.show();
    }
});