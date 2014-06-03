Ext.define('WeiQuPai.view.MyAuctionDetail', {
	extend: 'Ext.Container',
	xtype: 'myauctiondetail',
	requires: ['WeiQuPai.view.ShowOrder', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.BottomBar'],
	config: {
        disableSelection : true,
        scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '已拍详情',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				itemId: 'orderInfo',
				tpl: new Ext.XTemplate(
					'<div class="order-item-info">',
						'<img src="{[this.getCover(values.pic_cover)]}"/>',
						'<div class="info">',
							'<h2>{title}</h2>',
							'<div class="price-area"><p>您的成交价格<span class="price">￥{price}</span></div>',
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
						'<div class="flex row"><span class="label">状态</span><span id="statusText">{status:this.getStatusText}</span></div>',
						'<tpl if="coupon"><div class="flex row"><span class="label">拍券</span>{coupon.name}</div></tpl>',
						'<tpl if="prop"><div class="flex row"><span class="label">道具</span>{prop.name}</div></tpl>',
					'</div>',
					{
						getStatusText: function(status){
							return WeiQuPai.Config.orderStatusText[status];
						},

						getCover: function(cover){
		                    return WeiQuPai.Util.getImagePath(cover, '290');
		                }
					}
				)
			},
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item w-disclosure-item-single',
				title: '查看晒单',
				itemId: 'showOrder',
				titleStyle: 'normal',
				hidden: true
			},
			{
				xtype: 'disclosureitem',
				cls: 'w-disclosure-item w-disclosure-item-single',
				title: '查看物流',
				itemId: 'shipment',
				titleStyle: 'normal',
				hidden: true
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		var user = WeiQuPai.Util.checkLogin();
		if(!user) return;

		//清除红点
		WeiQuPai.Notify.newOrderClear(this.getRecord().get('id'));
		WeiQuPai.Notify.orderShipClear(this.getRecord().get('id'));

		var payBtn = Ext.create('Ext.Button', {text: '去支付', action: 'pay', cls: 'w-toolbar-button', iconCls: 'icon-pay', hidden: true});
		var showBtn = Ext.create('Ext.Button', {text: '晒单', action: 'showOrder', cls: 'w-toolbar-button', iconCls: 'icon-submit', hidden:true});
		var confirmBtn = Ext.create('Ext.Button', {text: '确认收货', action: 'confirm', cls: 'w-toolbar-button', iconCls: 'icon-submit', hidden: true});

		this.down('bottombar #buttonContainer').add([payBtn, showBtn, confirmBtn]);
		var status = this.getRecord().get('status');
		if(status == WeiQuPai.Config.orderStatus.STATUS_TOPAY){
			payBtn.show();
		}else if(status == WeiQuPai.Config.orderStatus.STATUS_TODEAL || status == WeiQuPai.Config.orderStatus.STATUS_SHIPMENT){
			confirmBtn.show();
		}
		if(status == WeiQuPai.Config.orderStatus.STATUS_SHIPMENT || status == WeiQuPai.Config.orderStatus.STATUS_FINISH){
			this.down('#shipment').show();
		}
		var orderId = this.getRecord().get('id');
		var model = WeiQuPai.model.Order;
		model.getProxy().setExtraParam('token', user.token);
		WeiQuPai.model.Order.load(orderId, {
			scope: this,
			success: function(record, operation){
				this.down('#orderInfo').setData(record.data);
			},
			failure: function(record, operation){
				WeiQuPai.Util.toast('数据加载失败');
			}
		});
	}
});
