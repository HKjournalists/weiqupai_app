/**
 * 专场的view
 */

Ext.define('WeiQuPai.view.SpecialSale', {
	extend: 'Ext.dataview.List',
	xtype: 'specialsale',
	requires: ['WeiQuPai.model.SpecialSale', 'WeiQuPai.view.ItemDetail'],
	config:{
        param: null,
		loadingText: null,
		store: 'SpecialSale',
        itemCls: 'today-item-row',
        disableSelection : true,
        itemTpl: new Ext.XTemplate(
        	'<p class="item-img"><img src="' + WeiQuPai.Config.host + '{pic_cover}" /></p>',
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
                title: '专场拍卖',
                docked: 'top',
                cls: 'w-title'
            },
	        {
	            xtype: 'container',
	        	scrollDock: 'top',
                tpl: new Ext.XTemplate(
                    '<div class="sale_pic"><img src="{[this.getPic(values.pic_url)]}"/></div>',
                    {
                        getPic: function(pic){
                            return WeiQuPai.Util.getImagePath(pic);
                        }
                    }
                ),
                itemId: 'saleInfo'
	        },
            {
                xtype: 'bottombar'
            }
        ]
	},

    firstLoad: true,

	initialize: function(){
		this.callParent(arguments);
        this.on('activate', this.onActivate, this);
   	}, 

    applyParam: function(param){
        this.down('titlebar').setTitle(param.title);
        this.loadData(param.id);
        return param;
    },

   	loadData: function(id){
        var model = WeiQuPai.model.SpecialSale;
        model.load(id, {
            scope: this,
            success: function(record, operation){
                this.down('#saleInfo').setData(record.data);
                this.getStore().removeAll();
                this.getStore().add(record.get('auctions'));
            },
            failure: function(record, operation){
                WeiQuPai.Util.toast('数据加载失败');  
            }
        });
   	},

    onActivate: function(){
        this.softRefresh();
    },

    //软刷新，只更新当前列表的状态和价格
    softRefresh: function(){

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
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/today/refresh&id=' + ids.join(","),
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
    }
});
