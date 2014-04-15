Ext.define('WeiQuPai.view.My', {
	extend: 'Ext.Container',
	xtype: 'my',
	requires: [
		'WeiQuPai.view.IconButton', 'WeiQuPai.view.MyFriend', 'WeiQuPai.view.Setting', 'WeiQuPai.view.MyProp', 'WeiQuPai.view.MyCoupon',
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
						'<img <tpl if="avatar">src="' + WeiQuPai.Config.host + '{avatar}"</tpl>/>',
						'<div class="info"><h2>{nick:htmlEncode}</h2>',
						'<p>{sign:htmlEncode}</p>',
						'</div>'
					)
				}
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
						icon: 'feed',
						text: '我的动态',
						action: 'feed'
					},
					{
						xtype: 'iconbutton',
						icon: 'consignee',
						text: '收货地址',
						action: 'consignee'
					}
					/*
					{
						xtype: 'iconbutton',
						icon: 'account',
						text: '帐号绑定',
						action: 'account'
					}
					*/
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				items:[
					
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
					},
					{
						xtype: 'iconbutton',
						icon: 'setting',
						text: '设置',
						action: 'setting'
					}
				]
			},
			/*
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
			*/
		]
	},

	initialize: function(){
		this.loginTip = Ext.create('WeiQuPai.view.LoginTip');
		this.add(this.loginTip);
		this.on('activate', this.loadData, this);
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
