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
	'<div class="user-row">',
	'<tpl if="action_class == 1">',
	'<div class="pic-list">',
	'<tpl for="pic">',
	'<img src="' + WeiQuPai.Config.host + '{url}" />',
	'</tpl>',
	'</div>',
	'</tpl>',
	'<p>{content}</p>',
    '<div class="flex"><div class="time">{time}</div><div class="up">{ups}</div><div class="comment">{comments}</div></div>',
	'</div>'
);


Ext.define('WeiQuPai.view.ShowUser', {
	extend: 'Ext.dataview.List',
	xtype: 'showuser',
	config: {
		emtpyText: '没有用户信息',
		store: 'ShowUserMessage',
		disableSelection : true,
		itemTpl: showusermessagetpl,
		items: [
			{
				xtype: 'container',
				scrollDock: 'top',
				itemId: 'user-info'
			},
			{
				xtype: 'bottombar'
			}
		],

		listeners: {
			itemtap: {
				order: 'before',
				fn: function(list, index, dataItem, record, e){
					if(e.target.className == 'up'){
						this.fireEvent('uptap', this, index, record);
						return false;
					}
					if(e.target.className == 'comment'){
						this.fireEvent('commenttap', this, index, record);
						return false;
					}
				}
			}
		}
	},

	initialize: function(){
		this.callParent(arguments);
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
