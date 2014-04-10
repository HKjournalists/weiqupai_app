Ext.define('WeiQuPai.view.WeiboShare', {
	extend: 'Ext.Container',
	requires: ['WeiQuPai.view.Iframe'],
	xtype: 'weiboshare',
	config: {
		items: [
			{
                xtype: 'titlebar',
                title: '分享到新浪微博',
                docked: 'top',
                cls: 'w-title',
            },
            {
            	xtype: 'iframe',
            },
	        {
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		this.on('painted', this.loadIframe, this);
	},

	applyData: function(data){
		return {
			title: data.title,
			url: data.url,
			pic: data.thumb,
			searchPic : 'false',
			appkey: '3289344208'
		};
	},

	loadIframe: function(){
        this.setMasked({xtype: 'wloadmask'});
		var iframe = this.down('iframe').element.query('iframe')[0];
		var me = this;
		iframe.onload = function(){
			me.iframeLoad();
		};
		var query = Ext.Object.toQueryString(this.getData());
		var baseUrl = 'http://service.weibo.com/share/mobile.php?';
		iframe.src = baseUrl + query;
	},

	iframeLoad: function(){
		this.unmask();
		var main = Ext.Viewport.down('main');
        main.push(this);
	}
});
