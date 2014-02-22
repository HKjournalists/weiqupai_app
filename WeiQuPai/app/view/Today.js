Ext.define('WeiQuPai.view.Today', {
	extend: 'Ext.dataview.List',
	xtype: 'today',
	requires: ['WeiQuPai.view.IndexAd', 'WeiQuPai.view.ItemDetail', 'Ext.plugin.ListPaging', 'Ext.plugin.PullRefresh'],
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
		],

		store: 'Item',
        itemCls: 'today-item-row',
        disableSelection : true,
        itemTpl: new Ext.XTemplate(
        	'<p class="item-img"><img src="' + WeiQuPai.Config.host + '{pic_cover}" /></p>',
            '<h2><span class="time">{status_text}</span>{title}</h2>',
            '<p><span class="market-price">市场价 {mprice}</span> / <span class="price">￥{curr_price}</span></p>'
        ),
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
	},
	initialize: function(){
		this.callParent(arguments);
 		var me = this;
 		WeiQuPai.Util.mask();
        this.getStore().load(function(data, operation, success){
        	WeiQuPai.Util.unmask();
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
            }
        });
   	}
});
