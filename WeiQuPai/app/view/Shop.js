Ext.define('WeiQuPai.view.Shop', {
	extend: 'Ext.Container',
	xtype: 'shop',
	require: [
	],

	config: {
		items:[
			{
                xtype: 'titlebar',
                title: '商家信息',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				itemId: 'shop-detail',
				cls: 'w-content',
				margin:'16px'
			},
			{
				xtype: 'button',
				text: '点击访问商家网站',
				action: 'jumpUrl',
				cls: 'w-margin w-button',
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	applyData: function(data){
		this.down('#shop-detail').setHtml(data.description);

	},

	initialize: function(){
	}
});
