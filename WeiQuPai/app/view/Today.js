Ext.define('WeiQuPai.view.Today', {
	extend: 'Ext.dataview.List',
	xtype: 'today',
	requires: [
		'WeiQuPai.view.IndexAd', 'WeiQuPai.view.ItemDetail', 'Ext.plugin.ListPaging', 'Ext.plugin.PullRefresh'
	],
	config:{
		plugins: [
			{
				xclass: 'Ext.plugin.PullRefresh',
				lastUpdatedText: '上次刷新：',
				lastUpdatedDateFormat: 'H点i分',
				loadingText: '加载中...',
				pullText: '下拉刷新',
				releaseText: '释放立即刷新',
				loadedText: '下拉刷新'
			},
			{
				xclass: 'Ext.plugin.ListPaging',
				autoPaging: true,
				loadMoreText: '加载中...',
				noMoreRecordsText: '亲，没有更多数据了'
			}
		],
		emtpyText: '没有可用的商品',
		store: 'Item',
        itemCls: 'today-item-row',
        disableSelection : true,
        itemTpl: ['<p class="item-img"><img src="' + WeiQuPai.Config.host + '{pic_url}" /></p>',
            '<h2><span class="time">起拍时间11:00</span>{name}</h2>',
            '<p><span class="market-price">市场价 {price}</span> / <span class="price">￥{price}</span></p>'].join(''),
            //'<p>已拍 {sold_num}  关注 {attention}</p>'].join(''),
        items: [
        	{
        		xtype: 'titlebar',
        		title: '今日',
        		docked: 'top'
        	},
	        {
	            xtype: 'indexad',
	        	scrollDock: 'top'
	        }
        ]
	}
});
