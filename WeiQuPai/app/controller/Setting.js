Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            about: 'disclosureitem[itemId=about]',
            retn: 'disclosureitem[itemId=return]',
            update: 'disclosureitem[itemId=update]',
            logoutBtn: 'button[action=logout]'
        },
        control: {
            about: {
                tap: 'showAbout'
            },
            retn: {
                tap: 'showReturn'
            },
            update: {
                tap: 'showUpdate'
            },
            logoutBtn: {
                tap: 'logout'
            }
        }
    },

    showAbout: function() {
        var view = Ext.create('WeiQuPai.view.About');
        this.getMain().push(view);
    },

    showReturn: function() {
        var view = Ext.create('WeiQuPai.view.ReturnAnnounce');
        this.getMain().push(view);
    },

    showUpdate: function() {
        var view = Ext.create('WeiQuPai.view.AppUpdate');
        this.getMain().push(view);
    },

    logout: function() {
        WeiQuPai.Util.logout();
        var layout = WeiQuPai.mainCard.getLayout();
        var animation = new Ext.fx.layout.Card('fade');
        animation.setLayout(layout);
        animation.on('animationend', function() {
            animation.destroy();
        });
        WeiQuPai.sidebar.updateUserInfo();
        WeiQuPai.sidebar.activeTabItem('today');
    }
});