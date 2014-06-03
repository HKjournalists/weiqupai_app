Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		about: 'disclosureitem[itemId=about]',
            priv: 'disclosureitem[itemId=private]',
            retn: 'disclosureitem[itemId=return]',
            newMessage: 'disclosureitem[itemId=newMessage]',
            update: 'disclosureitem[itemId=update]',
    	},
        control: {
        	about: {tap:'showAbout'}, 
            priv: {tap: 'showPrivate'},
            newMessage: {tap: 'showNewMessage'},
            retn: {tap: 'showReturn'},
            update: {tap: 'showUpdate'},
        }
    },

    showAbout: function(){
    	var view = Ext.create('WeiQuPai.view.About');
    	this.getMain().push(view);
    },

    showPrivate: function(){
        var view = Ext.create('WeiQuPai.view.Private');
        this.getMain().push(view);
    },

    showNewMessage: function(){
        var view = Ext.create('WeiQuPai.view.NewMessage');
        this.getMain().push(view);
    },

    showReturn: function(){
        var view = Ext.create('WeiQuPai.view.ReturnAnnounce');
        this.getMain().push(view);
    },

    showUpdate: function(){
        var view = Ext.create('WeiQuPai.view.AppUpdate');
        this.getMain().push(view);
    }
});
