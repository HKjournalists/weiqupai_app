/**
 * 订单提交成功后的页面
 *
 */

Ext.define('WeiQuPai.view.OrderSuccess', {
	extend: 'Ext.Container',
	xtype: 'ordersuccess',
	requires: ['WeiQuPai.view.Pay'],
	config: {
		orderData: null,
		scrollable: true,
		items: [
			{
                xtype: 'titlebar',
                title: '抢拍成功！',
                docked: 'top',
                cls: 'w-title'
            },
            {
            	xtype: 'container',
            	html: '请在30分钟内完成支付，不然订单会被取消哦',
            	cls:'w-tip',
            	docked:'top',
            	itemId: 'tip',
            	hideAnimation: {
            		type: 'fadeOut'
            	}
            },
            {
				xtype: 'container',
				itemId: 'orderInfo',
				tpl: new Ext.XTemplate(
					'<div class="order-item-info">',
						'<img src="' + WeiQuPai.Config.host + '{pic_cover}"/>',
						'<div class="info">',
							'<h2>{title}</h2>',
							'<div class="price-area"><p>现价￥{price}</p>',
							'<p>订单合计 ￥{total_pay}</p></div>',
						'</div>',
					'</div>',
					'<div class="order-info">',
						'<div class="flex row"><span class="label">订单号</span>{id}</div>',
						'<div class="flex row"><span class="label">收货人</span>{consignee_info.name:htmlEncode}</div>',
						'<div class="flex row"><span class="label">电话</span>{consignee_info.mobile:htmlEncode}</div>',
						'<div class="flex row"><span class="label">地址</span>{consignee_info.province}{consignee_info.city}{consignee_info.address:htmlEncode}</div>',
						'<div class="flex row"><span class="label">邮编</span>{consignee_info.zip:htmlEncode}</div>',
						'<div class="flex row"><span class="label">配送时间</span>{delivery_time}</div>',
						'<div class="flex row"><span class="label">支付方式</span>{payment}</div>',
						'<tpl if="coupon"><div class="flex row"><span class="label">拍券</span>{coupon.name}</div></tpl>',
						'<tpl if="prop"><div class="flex row"><span class="label">道具</span>{prop.name}</div></tpl>',
					'</div>'
				)
			},
            {
				xtype: 'bottombar'
			}
		]
	},

	tipTimer: null,

	applyOrderData: function(data){
		this.down('#orderInfo').setData(data);
		return data;
	},

	initialize: function(){
		var payBtn = {xtype: 'button', text: '去支付', action: 'pay', cls: 'w-toolbar-button', iconCls: 'icon-pay'};
		this.down('bottombar #buttonContainer').add(payBtn);
		this.down('button[action=pay]').on('tap', this.payBtnTap, this);
		this.hideTip();
		this.on('destroy', this.onDestroy, this);
	},

	hideTip: function(){
		var me = this;
		this.tipTimer = setTimeout(function(){
			me.down('#tip').hide();
		}, 30000);
	},

	payBtnTap: function(){
		var payment = this.getOrderData().payment;
		var orderId = this.getOrderData().id;
		WeiQuPai.Util.forward('pay', {orderId:orderId, payment:payment});
	},

	onDestroy: function(){
		if(this.tipTimer){
			clearTimeout(this.tipTimer);
			this.tipTimer = null;
		}
	}
});
