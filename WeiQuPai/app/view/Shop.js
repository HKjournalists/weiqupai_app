Ext.define('WeiQuPai.view.Shop', {
	extend: 'Ext.Container',
	xtype: 'shop',
	require: [
	],

	config: {
		items:[
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
		var html = '这里是商店的页面';
		var url = 'http://www.baidu.com';
		var linkButton = {
			xtype: 'button',
			text: '点击访问商家网站',
			action: 'jumpUrl',
			cls: 'shop-link-btn w-button',
			url : url
		};
		this.down('#shop-detail').setHtml(html);
		this.down('#shop-detail').add(linkButton);
	}
});
