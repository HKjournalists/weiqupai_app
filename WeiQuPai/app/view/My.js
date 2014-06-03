Ext.define('WeiQuPai.view.My', {
	extend: 'Ext.Container',
	xtype: 'my',
	requires: [
		'WeiQuPai.view.MyFriend', 'WeiQuPai.view.Setting', 'WeiQuPai.view.MyProp', 'WeiQuPai.view.MyCoupon',
		'WeiQuPai.view.MyAccount', 'WeiQuPai.view.MyConsignee', 'WeiQuPai.view.Profile'
	],

	config: {
		scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '我的',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'disclosureitem',
				itemId: 'profile',
				title: {
					xtype:'container',
					itemId: 'myInfo',
					cls: 'w-myinfo',
					tpl: new Ext.XTemplate(
						'<img <tpl if="avatar">src="{[this.getAvatar(values.avatar)]}"</tpl>/>',
						'<div class="info"><h2>{nick:htmlEncode}</h2>',
						'<p>{sign:htmlEncode}</p>',
						'</div>',
						{
							getAvatar: function(avatar){
								return WeiQuPai.Util.getImagePath(avatar, '140');
							}
						}
					)
				}
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-friend',
								iconAlign:'top',
								text: '我的好友',
								action: 'friend',
							}
						]
					},
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-feed',
								iconAlign:'top',
								text: '我的动态',
								action: 'feed',
							}
						]
					},
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-consignee',
								iconAlign:'top',
								text: '收货地址',
								action: 'consignee',
							}
						]
					}
					/*
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-account',
								iconAlign:'top',
								text: '帐号绑定',
								action: 'account',
								badgeCls: 'x-badge w-badge-mdot',
								badgeText:'12'
							}
						]
					}
					*/
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-coupon',
								iconAlign:'top',
								text: '我的拍券',
								action: 'coupon'
							}
						]
					},
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-setting',
								iconAlign:'top',
								text: '设置',
								action: 'setting'
							}
						]
					},
					{
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						flex: 1,
						items: [
							{
								xtype: 'button',
								baseCls: 'w-my-button w-my-button-prop',
								iconAlign:'top',
								text: '我的道具',
								action: 'prop',
								style:'visibility:hidden'
							}
						]
					},
				]
			}
		]
	},

	initialize: function(){
		this.loginTip = Ext.create('WeiQuPai.view.LoginTip');
		this.add(this.loginTip);
		this.on('activate', this.onActivate, this);
	},

	onActivate: function(){
		//检查通知
		WeiQuPai.Notify.notify([WeiQuPai.Notify.MSG_FRIEND_REQUEST, WeiQuPai.Notify.MSG_APP_UPDATE]);
		this.loadData();
	},

	loadData: function(){
        if(!WeiQuPai.Util.isLogin()){
        	Ext.each(this.getInnerItems(), function(cmp){
        		cmp.hide();
        	});
        	this.loginTip.show();
            return false;
        }
        this.loginTip.hide();

        this.down('#myInfo').setData(WeiQuPai.Cache.get('currentUser'));
		Ext.each(this.getInnerItems(), function(cmp){
    		cmp.show();
    	});        
    }
});
