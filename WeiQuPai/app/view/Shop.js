Ext.define('WeiQuPai.view.Shop', {
	extend: 'Ext.Container',
	xtype: 'shop',
	require: [
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '商户详情',
				docked: 'top'
			},
			{
				xtype: 'container',
				itemId: 'shop-detail',
				cls: 'shop-detail'
			},
			{
				xtype: 'bottombar'
			}
		]
	},
	initialize: function(){
		html = '这里是商店的页面';
		var linkButton = {
			xtype: 'button',
			text: '点击访问商家网站',
			action: 'jumpUrl'
		};
		this.down('#shop-detail').setHtml(html);
		this.down('#shop-detail').add(linkButton);
	}
});
