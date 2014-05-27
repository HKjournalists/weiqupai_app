Ext.define('WeiQuPai.view.Pay', {
	extend: 'Ext.Container',
	requires: ['WeiQuPai.view.Iframe'],
	xtype: 'pay',
	config: {
		orderId: null,
		payment: '支付宝',
		items: [
			{
                xtype: 'titlebar',
                title: '支付',
                docked: 'top',
                cls: 'w-title',
            },
            {
            	xtype: 'iframe',
           		itemId: 'payIframe' 	
            },
	        {
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		this.on('painted', this.loadIframe, this);
	},

	loadIframe: function(){
		var user = WeiQuPai.Cache.get('currentUser');
		var url = WeiQuPai.Config.apiUrl + "/?r=app/pay&id=" + this.getOrderId() + '&token=' + user.token;
		var url = "http://baidu.com";
		window.open(url, '_blank', 'location=yes');
		return;
		var user = WeiQuPai.Cache.get('currentUser');
        this.setMasked({xtype: 'wloadmask'});
		var payIframe = this.down('#payIframe').element.query('iframe')[0];
		var me = this;
		payIframe.onload = function(){
			me.payIframeLoad();
		};
		payIframe.src = WeiQuPai.Config.apiUrl + "/?r=app/pay&id=" + this.getOrderId() + '&token=' + user.token;
	},

	payIframeLoad: function(){
		this.unmask();
	}
});
