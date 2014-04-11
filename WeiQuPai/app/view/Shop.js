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
				hidden: true
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	applyData: function(data){
		this.down('#shop-detail').setHtml(data.description);
		data.href = "http://www.vqupai.com";
		data.href && this.down('button').setHidden(false);
		this.down('button').on('tap', function(){
			window.open(data.href, '_system');
		});
	}
});
