Ext.define('WeiQuPai.view.My', {
	extend: 'Ext.Container',
	xtype: 'my',
	requires: [
		'WeiQuPai.view.IconButton', 'WeiQuPai.view.MyFriend', 'WeiQuPai.view.Setting', 'WeiQuPai.view.MyProp', 'WeiQuPai.view.MyCoupon',
		'WeiQuPai.view.MyAccount', 'WeiQuPai.view.MyConsignee'
	],

	config: {
		scrollable: true,
		items:[
			{
				xtype: 'titlebar',
				title: '我的',
				docked: 'top'
			},
			{
				xtype: 'container',
				itemId: 'myInfo',
				cls: 'w-disclosure-item',
				items:[
					{
						xtype:'container',
						cls: 'w-myinfo',
						html: '<img src="resources/images/icon-avatar.png"/><h2>Pony</h2><p>生命是一场不一样的旅行</p>'

					},
					{
						xtype: 'container',
						baseCls: 'w-disclosure',
						docked: 'right'
					}
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					{
						xtype: 'iconbutton',
						icon: 'friend',
						text: '我的好友',
						action: 'friend'
					},
					{
						xtype: 'iconbutton',
						icon: 'account',
						text: '帐号绑定',
						action: 'account'
					}
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					{
						xtype: 'iconbutton',
						icon: 'consignee',
						text: '收货地址',
						action: 'consignee'
					},
					{
						xtype: 'iconbutton',
						icon: 'prop',
						text: '我的道具',
						action: 'prop'
					},
					{
						xtype: 'iconbutton',
						icon: 'coupon',
						text: '我的拍券',
						action: 'coupon'
					}
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					{
						xtype: 'iconbutton',
						icon: 'setting',
						text: '设置',
						action: 'setting'
					}
				]
			}
		]
	}
});
