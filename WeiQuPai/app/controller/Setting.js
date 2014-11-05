Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            about: 'disclosureitem[itemId=about]',
            retn: 'disclosureitem[itemId=return]',
            update: 'disclosureitem[itemId=update]',
            feedback: 'disclosureitem[itemId=feedback]',
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
            feedback: {
                tap: 'showFeedBack'
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

    showFeedBack: function() {
        var view = Ext.create('WeiQuPai.view.FeedBack');
        this.getMain().push(view);
    },

    logout: function() {
        WeiQuPai.Util.logout();
    }
});