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
		this.down('bottombar').insert(2, {xtype: 'button', text: '去支付', action: 'pay'});
		this.down('bottombar').insert(3, {xtype: 'spacer'});
		this.addShipment();
		this.addPayment();
		this.addDeliveryTime();
	}, 

	addShipment: function(){
        var shipmentListView = this.createOverlay('WeiQuPai.view.ShipmentList');
        this.selectFirst('shipment', shipmentListView.down('list'));
	},

	addPayment: function(){
		var paymentListView = this.createOverlay('WeiQuPai.view.PaymentList');
        this.selectFirst('payment', paymentListView.down('list'));
	},

	addDeliveryTime: function(){
		var deliveryTimeView = this.createOverlay('WeiQuPai.view.DeliveryTimeList');
        this.selectFirst('deliverytime', deliveryTimeView.down('list'));
	},

	selectFirst: function(itemId, list){
        if(list.getSelectionCount() == 0){
            list.select(0);
        }
        var title = list.getItemAt(0).getRecord().get('title');
        this.getRecord().set(itemId, title);
        this.down('disclosureitem[itemId=' + itemId + ']').setContent(title);
	},

	createOverlay: function(com){
		var cmp = Ext.create(com, {
			bottom: 0,
            left:0,
            hidden: true,
            height: '50%',
            width: '100%',
            showAnimation:{
                type: 'slideIn',
                direction: 'up'
            },
            hideAnimation:{
            	type: 'slideOut',
            	direction: 'down'
            },
            modal: true,
            hideOnMaskTap: true
        });
       	Ext.Viewport.add(cmp);
       	return cmp;
	}
});
