Ext.define('WeiQuPai.view.Brand', {
	extend: 'Ext.Container',
	xtype: 'brand',
	config: {
		scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '品牌介绍',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				itemId: 'brand-detail',
				cls: 'w-brand-info',
				tpl: new Ext.XTemplate(
					'<p class="brand-logo"><img src=' + WeiQuPai.Config.host + '{logo} height="75"/></p>',
					'<p>{description:htmlEncode}</p>'
				)
			},
			{
				xtype: 'button',
				text: '点击访问品牌网站',
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
		this.down('#brand-detail').setData(data);
		data.site && this.down('button').setHidden(false);
		this.down('button').on('tap', function(){
			window.open(data.site, '_system');
		});
	}
});
