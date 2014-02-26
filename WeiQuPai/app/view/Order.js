Ext.define('WeiQuPai.view.Order', {
	extend: 'Ext.Container',
	xtype: 'order',
	requires: ['WeiQuPai.view.DisclosureItem', 'WeiQuPai.view.PaymentList', 'WeiQuPai.view.ShipmentList', 'WeiQuPai.view.DeliveryTimeList',
		'WeiQuPai.view.ConsigneeList', 'WeiQuPai.model.Order', 'WeiQuPai.view.MyCoupon', 'WeiQuPai.view.MyProp'],
	config: {
		auctionData: null,
		scrollable: true,
		items: [
			{
				xtype: 'titlebar',
				title: '订单详情',
				docked: 'top'
			},
			{
				xtype: 'container',
				itemId: 'itemInfo',
				tpl: new Ext.XTemplate(
					'<div class="order-item-info">',
						'<img src="' + WeiQuPai.Config.host + '{pic_cover}"/>',
						'<div class="info">',
							'<h2>{title}</h2>',
							'<div class="price-area"><p>现价￥{curr_price}</p>',
							'<p>订单合计 ￥{total_pay}</p></div>',
						'</div>',
					'</div>'
				)
			},
			{
				xtype: 'disclosureitem',
				itemId: 'consignee',
				title: '收货信息',
				content: '',
				contentPosition: 'bottom'
			},
			{
				xtype: 'disclosureitem',
				itemId: 'delivery_time',
				title: '配送时间',
				content: ''
			},
			{
				xtype: 'disclosureitem',
				itemId: 'prop',
				title: '使用道具',
				content: ''
			},
			{
				xtype: 'disclosureitem',
				itemId: 'coupon',
				title: '使用拍券',
				content: ''
			},
			{
				xtype: 'disclosureitem',
				itemId: 'payment',
				title: '支付方式',
				content: ''
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	initialize: function(){
		var order = Ext.create('WeiQuPai.model.Order');
		this.setRecord(order);
		var payBtn = {xtype: 'button', text: '去支付', action: 'pay', cls: 'w-toolbar-button', iconCls: 'icon-pay'};
		this.down('bottombar #buttonContainer').add(payBtn);
		this.addPayment();
		this.addDeliveryTime();
	}, 

	applyAuctionData: function(data){
		data.total_pay = data.curr_price;
		this.getRecord().set('price', data.curr_price);
		this.getRecord().set('item_id', data.item_id);
		this.getRecord().set('auction_id', data.id);
		this.getRecord().set('total_pay', data.curr_price)
		this.down('#itemInfo').setData(data);
	},

	addPayment: function(){
		var paymentListView = WeiQuPai.Util.createOverlay('WeiQuPai.view.PaymentList');
        this.selectFirst('payment', paymentListView.down('list'));
	},

	addDeliveryTime: function(){
		var deliveryTimeView = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeliveryTimeList');
        this.selectFirst('delivery_time', deliveryTimeView.down('list'));
	},

	selectFirst: function(itemId, list){
        if(list.getSelectionCount() == 0){
            list.select(0);
        }
        var title = list.getItemAt(0).getRecord().get('title');
        this.getRecord().set(itemId, title);
        this.down('disclosureitem[itemId=' + itemId + ']').setContent(title);
	}
});
