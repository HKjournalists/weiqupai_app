Ext.define('WeiQuPai.view.Order', {
	extend: 'Ext.Container',
	xtype: 'order',
	requires: ['WeiQuPai.view.DisclosureItem', 'WeiQuPai.view.PaymentList', 'WeiQuPai.view.ShipmentList', 'WeiQuPai.view.DeliveryTimeList',
		'WeiQuPai.view.ConsigneeList', 'WeiQuPai.model.Order'],
	config: {
		scrollable: true,
		items: [
			{
				xtype: 'titlebar',
				title: '订单详情',
				docked: 'top'
			},
			{
				xtype: 'panel',
				html: ['<div class="order-item-info">',
					'<img src="' + WeiQuPai.Config.host + 'pic/5s.jpg" class="avatar"/>',
					'<div class="info">',
					'<h2>Suit椅</h2>',
					'<div class="price-area">',
					'<span class="price">现价￥55.00</span><span class="total-pay">订单合计 ￥65.00</span>',
					'</div>'].join('')
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
				itemId: 'shipment',
				title: '配送方式',
				content: ''
			},
			{
				xtype: 'disclosureitem',
				itemId: 'deliverytime',
				title: '配送时间',
				content: ''
			},
			{
				xtype: 'disclosureitem',
				itemId: 'prop',
				title: '优惠信息',
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
		this.setRecord(Ext.create('WeiQuPai.model.Order'));
		var payBtn = {xtype: 'button', text: '去支付', action: 'pay', cls: 'w-toolbar-button', iconCls: 'icon-pay'};
		this.down('bottombar #buttonContainer').add(payBtn);
		this.addShipment();
		this.addPayment();
		this.addDeliveryTime();
	}, 

	addShipment: function(){
        var shipmentListView = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShipmentList');
        this.selectFirst('shipment', shipmentListView.down('list'));
	},

	addPayment: function(){
		var paymentListView = WeiQuPai.Util.createOverlay('WeiQuPai.view.PaymentList');
        this.selectFirst('payment', paymentListView.down('list'));
	},

	addDeliveryTime: function(){
		var deliveryTimeView = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeliveryTimeList');
        this.selectFirst('deliverytime', deliveryTimeView.down('list'));
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
