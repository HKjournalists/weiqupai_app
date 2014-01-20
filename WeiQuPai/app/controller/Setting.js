Ext.define('WeiQuPai.controller.Setting', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		about: 'disclosureitem[itemId=about]'
    	},
        control: {
        	about: {tap:'showAbout'}, 
        }
    },

    showAbout: function(){
    	var view = Ext.create('WeiQuPai.view.About');
    	this.getMain().push(view);
    },
});
