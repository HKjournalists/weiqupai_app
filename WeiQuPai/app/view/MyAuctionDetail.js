Ext.define('WeiQuPai.view.MyAuctionDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'myauctiondetail',
	requires: ['WeiQuPai.view.Shop', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.ShowOrder'],
	config: {
		title: '已拍详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        itemCls: 'auction-user-item',
		itemTpl: ['<div class="auction-user-row">',
                '<img src="http://localhost:8080/WeiQuPai/{pic_url}" />',
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
				id: 'funcList',
				xtype: 'list',
				scrollDock: 'top',
				onItemDisclosure: true,
				disableSelection: true,
				scrollable : false,
				store: {
					fields: ['title'],
					data: [
						{title: '北京商贸有限公司', id: 'shop'},
						{title: '查看物流', id: 'shipment'},
						{title: '查看晒单', id: 'showorder'}
					]
				},
				itemTpl : '{title}',
				listeners: {
				    painted: function() {
				        this.setHeight(this.itemsCount*this.getItemHeight() + 10);
				    }
				}
			}
		],
	}
});
