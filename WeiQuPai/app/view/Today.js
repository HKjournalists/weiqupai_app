Ext.define('WeiQuPai.view.Today', {
	extend: 'Ext.dataview.List',
	xtype: 'today',
	requires: ['WeiQuPai.view.Banner', 'WeiQuPai.view.ItemDetail'],
	config:{
		plugins: [
			{
				type: 'pullrefresh',
				lastUpdatedText: '上次刷新：',
				lastUpdatedDateFormat: 'H点i分',
				loadingText: '加载中...',
				pullText: '下拉刷新',
				releaseText: '释放立即刷新',
				loadedText: '下拉刷新'
			}
		],
		loadingText: null,
		store: 'Auction',
        itemCls: 'today-item-row',
        disableSelection : true,
        itemTpl: new Ext.XTemplate(
        	'<p class="item-img"><img src="' + WeiQuPai.Config.host + '{pic_cover}" /></p>',
            '<h2><span class="time">{status_text}</span>{title}</h2>',
            '<p><span class="market-price">原价 {oprice}</span> / <span class="price">￥{curr_price}</span></p>'
        ),
        items: [
        	{
                xtype: 'titlebar',
                title: '今日',
                docked: 'top',
                cls: 'w-title',
                items: [
                	{
                		xtype: 'button',
                		text: '支付',
                		listeners: {
                			tap: function(){
                				WeiQuPai.Util.forward('pay');
                			}
                		}
                	}
                ]
            },
	        {
	            xtype: 'banner',
	        	scrollDock: 'top'
	        }
        ]
	},
	initialize: function(){
		this.callParent(arguments);
 		var me = this;
        this.setMasked({xtype: 'simpleloadmask'});
 		var user = WeiQuPai.Cache.get('currentUser');
		user &&	this.getStore().getProxy().setExtraParam('token', user.token);
        this.getStore().load(function(data, operation, success){
        	this.unmask();
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
            }
        }, this);
   	}
});
