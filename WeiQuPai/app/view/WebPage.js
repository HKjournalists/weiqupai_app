Ext.define('WeiQuPai.view.WebPage', {
	extend: 'Ext.Container',
	requires: ['WeiQuPai.view.Iframe'],
	xtype: 'webpage',
	config: {
		title: null,
		href: null,
		items: [
			{
                xtype: 'titlebar',
                docked: 'top',
                cls: 'w-title',
            },
            {
            	xtype: 'iframe'
            },
	        {
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		this.on('painted', this.loadIframe, this);
	},

	applyTitle: function(title){
		this.down('titlebar').setTitle(title || '微趣拍');
		return title;
	},

	applyHref: function(href){
        this.setMasked({xtype: 'wloadmask'});
		var iframe = this.down('iframe').element.query('iframe')[0];
		var me = this;
		iframe.onload = function(){
			me.iframeLoad();
		};
		iframe.src = href;
	},

	iframeLoad: function(){
		this.unmask();
	}
});
