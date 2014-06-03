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
				cls: 'w-brand-info',
				tpl: new Ext.XTemplate(
					'<tpl if="pic_url"><p class="brand-logo"><img src="' + WeiQuPai.Config.host + '{pic_url}" height="75"/></p></tpl>',
					'<h3>{title}</h3>',
					'<p>{description:htmlEncode}</p>'
				)
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
		this.down('#shop-detail').setData(data);
		data.site && this.down('button').setHidden(false);
		this.down('button').on('tap', function(){
			window.open(data.site, '_system');
		});
	}
});
