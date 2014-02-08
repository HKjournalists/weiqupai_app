Ext.define('WeiQuPai.view.MyAuctionDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'myauctiondetail',
	requires: ['WeiQuPai.view.MyAuctionTextList', 'WeiQuPai.view.Shop', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.ShowOrder', 'WeiQuPai.view.BottomBar'],
	config: {
		loadinText: '加载中...',
		store: 'Item',
        disableSelection : true,
		itemTpl: new Ext.XTemplate(
			'<div class="auction-user-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<div class="flex"><div class="time">30分钟前</div><div class="up">100</div><div class="comment">500</div></div>',
                '<div class="reply">',
                	'<div><span class="uname">天天</span>：是谁说的？</div>',
                	'<div><span class="uname">天天</span>：故事还没完呢？</div>',
                	'<div><span class="uname">天天</span>：你们还没放假吗？</div>',
                	'<div><span class="uname">天天</span>：明天晚上来我家吃吧。</div>',
                	'<div><span class="uname">天天</span>：好用不？好用明天我也拍一个</div>',
                '</div>',
            '</div>'
        ),
		items:[
			{
				xtype: 'titlebar',
				title: '已拍详情',
				docked: 'top'
			},
			{
				xtype: 'panel',
				cls: 'auction-info',
				html: '<h2>Iphone 5S土豪金</h2><p>您的成交价格<span class="price">￥55.00</span></p>',
				scrollDock: 'top'
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
