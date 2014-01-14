var showusertpl = new Ext.XTemplate(
	'<div class="circle-row">',
	'<div class="circle-info">',
	'<tpl if="action_class == 1">',
	'<p>',
	'<tpl for="pic">',
	'<img class="pic" src="' + WeiQuPai.Config.host + '{url}" />',
	'</tpl>',
	'</p>',
	'</tpl>',
	'<p>{content}</p>',
	'<p class="time">{time}</p>',
	'</div>'
);

Ext.define('WeiQuPai.view.ShowUser', {
	extend: 'Ext.dataview.List',
	xtype: 'showuser',
	requires: ['WeiQuPai.model.User'],
	config: {
		emtpyText: '没有动态信息',
		//store: 'ShowUser',
		disableSelection : true,
		itemTpl: showusertpl,
		items: [
			{
				xtype: 'panel',
				//centered: true,
				scrollDock: 'top',
				itemId: 'user-info',
				tpl: 	new Ext.XTemplate('<div class="user-show-top">',
						'<div class="user-show-bg">',
						'<img src="{user_bg}">',
						'</div>',
						'<div class="user-show-avatar">',
						'<img src="{user_icon}" />',
						'<span class="user-show-name">{user_name}</span>',
						'</div>',
						'</div>')
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	initialize: function(){
		var me = this;
		var model = Ext.ModelManager.getModel('WeiQuPai.model.User');
		model.load(10, {
			callback: function(user){
				me.setStore(user.messages());
				me.down('#user-info').setRecord(user);
			}
		});
		/*
		var myStore = this.getStore()
		var url = WeiQuPai.Config.host + 'showuser' + this.trans_id + '.json';
		//console.log(url);
		myStore.getProxy().setUrl(url);
		myStore.load();
		console.log(myStore.getData());
		*/
	}

});
