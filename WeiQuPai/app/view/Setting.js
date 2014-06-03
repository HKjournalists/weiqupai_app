Ext.define('WeiQuPai.view.Setting', {
	extend: 'Ext.Container',
	xtype: 'setting',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'WeiQuPai.view.About', 'WeiQuPai.view.Private', 'WeiQuPai.view.NewMessage',
		'WeiQuPai.view.ReturnAnnounce', 'WeiQuPai.view.AppUpdate'
	],

	config: {
		items:[
			{
                xtype: 'titlebar',
                title: '设置',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item text',
				title: '<div class="flex"><div>新消息通知</div><div><span class="x-badge" style="display:none"></span></div>',
				itemId: 'newMessage'	
			},
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item text',
				title: '<div class="flex"><div>隐私</div><div><span class="x-badge" style="display:none"></span></div>',
				itemId: 'private'	
			},

			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item w-disclosure-item-single text',
				title: '<div class="flex"><div>退货说明</div><div><span class="x-badge" style="display:none"></span></div>',
				itemId: 'return'
			},	
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item text',
				title: '<div class="flex"><div>关于微趣拍</div><div><span class="x-badge" style="display:none"></span></div>',
				itemId: 'about',
			},
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item text',
				title: '<div class="flex"><div>检查更新</div><div><span class="x-badge" style="display:none"></span></div>',
				itemId: 'update'
			},	
			{
				xtype: 'button',
				text: '退出登录',
				cls: 'w-button w-button-logout',
				action: 'logout'
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.on('painted', this.onPainted);
	},

	onPainted: function(){
		WeiQuPai.Notify.notify(WeiQuPai.Notify.MSG_APP_UPDATE);
	}
});
