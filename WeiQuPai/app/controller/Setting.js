Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		about: 'disclosureitem[itemId=about]',
            priv: 'disclosureitem[itemId=private]'
    	},
        control: {
        	about: {tap:'showAbout'}, 
            priv: {tap: 'showPrivate'}
        }
    },

    showAbout: function(){
    	var view = Ext.create('WeiQuPai.view.About');
    	this.getMain().push(view);
    },

    showPrivate: function(){
        var view = Ext.create('WeiQuPai.view.Private');
        this.getMain().push(view);
    }
});
