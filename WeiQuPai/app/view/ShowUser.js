var showuserinfotpl = new Ext.XTemplate(
	'<div class="user-show-top">',
	'<div class="user-show-bg">',
	'<img src="{user_bg}">',
	'</div>',
	'<div class="user-show-avatar">',
	'<img src="{user_icon}" />',
	'<span class="user-show-name">{user_name}</span>',
	'</div>',
	'</div>'
);
var showusermessagetpl = new Ext.XTemplate(
	'<div class="comment-row">',
	'<tpl if="action_class == 1">',
	'<p>',
	'<tpl for="pic">',
	'<img class="show-order-pic-small" src="' + WeiQuPai.Config.host + '{url}" />',
	'</tpl>',
	'</p>',
	'</tpl>',
	'<p>{content}</p>',
    '<p><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">{time}</span></p>',
	'</div>'
);


Ext.define('WeiQuPai.view.ShowUser', {
	extend: 'Ext.dataview.List',
	xtype: 'showuser',
	//requires: ['WeiQuPai.view.ShowUserInfo', 'WeiQuPai.view.ShowUserMessage'],
	config: {
		id: 'showuser',
		emtpyText: '没有用户信息',
		store: 'ShowUserMessage',
		disableSelection : true,
		itemTpl: showusermessagetpl,
		items: [
			{
				xtype: 'panel',
				//centered: true,
				scrollDock: 'top',
				itemId: 'user-info',
				//tpl: showuserinfotpl
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	initialize: function(){
		var me = this;
		var getStore = Ext.data.StoreManager.lookup('ShowUserInfo');
		getStore.load(function(records, operation, success){
			if(success){
				var html = showuserinfotpl.applyTemplate(getStore.getAt(0).getData());
				me.down('#user-info').setHtml(html);
			}
		});
		var message = Ext.data.StoreManager.lookup('ShowUserMessage');
		message.load();
	}

});
