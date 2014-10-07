/**
 * 可以滚动的iframe组件
 *
 */
Ext.define('WeiQuPai.view.Iframe', {
	extend: 'Ext.Component',
	xtype: 'iframe',

	config: {
		style: '-webkit-overflow-scrolling:touch;height:600px;overflow:auto;',
		href: false
	},

	template: [
		{
			reference: 'iframeElement',
			tag: 'iframe',
			style: 'height:100%;width:100%;border:0;'
		}
	],

	updateHref: function(href){
		if(href) this.iframeElement.set({ src: href });
	}
});