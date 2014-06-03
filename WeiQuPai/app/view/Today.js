Ext.define('WeiQuPai.view.Today', {
	extend: 'Ext.dataview.List',
	xtype: 'today',
	requires: ['WeiQuPai.view.Banner', 'WeiQuPai.view.ItemDetail', 'WeiQuPai.view.SpecialSale', 'WeiQuPai.view.TodayMenu'],
	config:{
		plugins: [
			{
				type: 'wpullrefresh',
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
        	'<p class="item-img"><img src="{[this.getCover(values.pic_cover)]}"/></p>',
            '<h2>{title}</h2>',
            '<p class="{[this.statusCss(values.status)]}"><span class="status">{status_text}</span><span class="price-container"><span class="market-price">原价 {oprice}</span> <span class="price">{[this.displayPrice(values)]}</span></span></p>',
            {
                statusCss: function(status){
                    var css = {};
                    css[WeiQuPai.Config.auctionStatus.STATUS_NOT_START] = 'not-start';
                    css[WeiQuPai.Config.auctionStatus.STATUS_ONLINE] = 'online';
                    css[WeiQuPai.Config.auctionStatus.STATUS_FINISH] = 'finish';
                    return css[status];
                },

                getCover: function(cover){
                    return WeiQuPai.Util.getImagePath(cover, '290');
                },

            	displayPrice: function(values){
            		var auctions = WeiQuPai.Cache.get('auctions');
            		if(auctions && auctions.indexOf(values.id) != -1){
            			return '已拍';
            		}
            		return '￥' + values.curr_price;
            	}
            }
        ),
        items: [
        	{
                xtype: 'titlebar',
                title: '今日',
                docked: 'top',
                cls: 'w-title',
            },
	        {
	            xtype: 'banner',
	        	scrollDock: 'top'
	        }
        ]
	},

    firstLoad: true,

	initialize: function(){
		this.callParent(arguments);
        this.loadData();
        this.on('activate', this.onActivate, this);
        this.on('hide', this.onHide, this);
   	}, 

   	loadData: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        this.getStore().getProxy().setExtraParam('token', user && user.token || '');
        this.getStore().load(function(data, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
   	},

    onActivate: function(){
        this.loadMenu();
        this.softRefresh();
    },

    //软刷新，只更新当前列表的状态和价格
    softRefresh: function(){
        //刷新广告 
        this.down('banner').updateBanner();

        if(this.firstLoad){
            this.firstLoad = false;
            return;
        }

        var store = this.getStore(),
            proxy = store.getProxy(),
            operation;
        ids = [];
        store.each(function(item, index, length){
            ids.push(item.get('id'));
        });

        var user = WeiQuPai.Cache.get('currentUser');
        var tk = user && user.token || '';
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/today/refresh&id=' + ids.join(",") + '&token=' + tk,
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                var records = store.getData();
                var record;
                for(var i=0,len=rsp.length; i<len; i++){
                    record = records.getByKey(rsp[i].id);
                    record.set(rsp[i]);
                }
            }
        });
    },

    //加载标题栏的下拉菜单项目[专场的id,title]
    loadMenu: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        var tk = user && user.token || '';
        var self = this;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/specialSale/title&token=' + tk,
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                this.setDynamicTitie(rsp);
            },
            scope: this
        });
    },

    setDynamicTitie: function(menu){
        if(!menu || menu.length == 0){
            this.down('titlebar').titleComponent.setHtml('今日');
            return;
        }
        var popMenu = WeiQuPai.Util.getGlobalView('WeiQuPai.view.TodayMenu');
        popMenu.clearButton();
        for(var i=0; i<menu.length; i++){
            popMenu.addItem(menu[i]);
        }
        var titleEl = this.down('titlebar').titleComponent;
        titleEl.setHtml('<div class="dropdown-title">今日</div>');
        var self = this;
        titleEl.element.down('.dropdown-title').on('tap', function(){
            //this.addCls('open');
            popMenu.showBy(self.down('titlebar'));
        });
    },

    onHide: function(){
        this.down('banner').stopTimer();
    }
});
