Ext.define('WeiQuPai.view.MyAuctionDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'myauctiondetail',
	requires: ['WeiQuPai.view.MyAuctionTextList', 'WeiQuPai.view.Shop', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.ShowOrder', 'WeiQuPai.view.BottomBar'],
	config: {
		title: '已拍详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        itemCls: 'auction-user-item',
		itemTpl: ['<div class="auction-user-row">',
                '<img src="' + config.host + '{pic_url}" />',
                '<div class="auction-user-info">',
                '<h2>{name}</h2>',
                '<p><span class="up_area">赞 100 评论 500</span>2012-12-12</p>',
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
		],
	}
});
