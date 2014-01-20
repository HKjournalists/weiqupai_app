Ext.define("WeiQuPai.view.IconButton", {
	extend: 'Ext.Container', 
	xtype: 'iconbutton',
	config:{
		text: null,
		icon: null,
		cls: 'w-my-button'

	},

	setText: function(text){
		this.setHtml(text);
	},

	setIcon: function(icon){
		this.setCls('w-my-button w-my-button-' + icon);
	},
	
	initialize: function(){
		this.relayEvents(this.element, ['tap', 'singletap']);
	}
});