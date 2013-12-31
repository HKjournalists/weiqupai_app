Ext.define('WeiQuPai.view.MyAuctionDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'myauctiondetail',
	requires: ['WeiQuPai.view.MyAuctionTextList', 'WeiQuPai.view.Shop', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.ShowOrder', 'WeiQuPai.view.BottomBar'],
	config: {
		title: '已拍详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        pressedCls : '',
        itemCls: 'auction-user-item',
		itemTpl: ['<div class="auction-user-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<p><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">2012-12-12</span></p>',
                '</div>'].join(''),
		items:[
			{
				xtype: 'panel',
				cls: 'auction-info',
				html: '<h2>Iphone 5S土豪金</h2><p>您的成交价格<span class="price">￥55.00</span></p>',
				scrollDock: 'top',
			},
			{
				xtype: 'myauctiontextlist'
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
