Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		about: 'disclosureitem[itemId=about]',
            priv: 'disclosureitem[itemId=private]',
            newMessage: 'disclosureitem[itemId=newMessage]'
    	},
        control: {
        	about: {tap:'showAbout'}, 
            priv: {tap: 'showPrivate'},
            newMessage: {tap: 'showNewMessage'}
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
    }
});
