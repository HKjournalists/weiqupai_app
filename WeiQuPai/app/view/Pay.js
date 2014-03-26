Ext.define('WeiQuPai.view.Pay', {
	extend: 'Ext.Container',
	requires: ['WeiQuPai.view.Iframe'],
	xtype: 'pay',
	config: {
		orderId: 5,
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
		//去掉返回的按钮
		this.down('button[action=back]').hide();
		this.on('painted', this.loadIframe, this);
	},

	loadIframe: function(){
        this.setMasked({xtype: 'simpleloadmask'});
		var payIframe = this.down('#payIframe').element.query('iframe')[0];
		var me = this;
		payIframe.onload = function(){
			me.payIframeLoad();
		};
		payIframe.src = WeiQuPai.Config.apiUrl + "/?r=app/pay&id=" + this.getOrderId() + '&payment=' + this.getPayment();	
	},

	payIframeLoad: function(){
		this.unmask();
		var main = Ext.Viewport.down('main');
        main.push(this);
	}
});
