Ext.define('WeiQuPai.view.ItemDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'itemdetail',
	requires: [
		'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.DisclosureItem',
		'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Order', 'WeiQuPai.model.Auction',
		'WeiQuPai.view.ShareLayer'
	],
	config: {
		plugins: [
			{
				type: 'wlistpaging',
		        autoPaging: true,
			}
		],
		param: null,
		store: 'AuctionComment',
		loadingText: null,
        disableSelection : true,
        pressedCls : '',
		itemTpl: new Ext.XTemplate(
			'<div class="comment-row">',
			'<tpl if="avatar">',
			'<img src="' + WeiQuPai.Config.host + '{avatar}" class="avatar"/>',
			'<tpl else>',
			'<img class="avatar"/>',
			'</tpl>',
            '<div class="info">',
            '<h3>{nick:htmlEncode}</h3>',
            '<p>{content:htmlEncode}</p>',
            '<div class="flex"><div class="time">{ctime}</div><div class="up">{up_num}</div><div class="comment">{reply_num}</div></div>',
            '<tpl if="replies">',
	            '<div class="reply" style="margin-top:10px">',
	            	'<tpl for="replies">',
	            	'<div><span class="uname">{nick:htmlEncode}</span>：{content:htmlEncode}</div>',
	            	'</tpl>',
	            '</div>',
            '</tpl>',
            '</div>'
        ),
		items:[
			{
                xtype: 'titlebar',
                title: '拍品详情',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'detailpicshow',
				scrollDock: 'top'
			},
			{
				xtype: 'container',
				scrollDock: 'top',
				itemId: 'itemTitle',
				tpl: new Ext.XTemplate(
					'<h2><span class="market-price">原价￥{oprice}</span><span class="price">{[this.formatPrice(values)]}</span>{title}</h2>',
					{
						formatPrice: function(values){
							var auctions = WeiQuPai.Cache.get('auctions');
		            		if(auctions && auctions.indexOf(values.id) != -1){
		            			return '已拍';
		            		}
							curr_price = values.curr_price || "0";
							var numbers = curr_price.split("");
							var res = [];
							Ext.Array.each(numbers, function(n){
								n = n == '.' ? 'dot' : n;
								res.push('<span class="n n' + n + '"></span>');
							});
							return res.join("");
						}
					}
				),
				cls : 'item-detail-info'
			},
			{
				xtype: 'disclosureitem',
				title: '商家介绍',
				titleStyle: 'normal',
				itemId: 'shopInfo',
				scrollDock: 'top',
				hidden: true
			},
			{
				xtype: 'container',
				cls: 'item-detail-desc',
				itemId: 'itemDesc',
				tpl: '{description}{button}',
				scrollDock: 'top'
			},
			{
				xtype: 'bottombar'
			}
		], 

		listeners: {
			itemtap: {
				order: 'before',
				fn: function(list, index, dataItem, record, e){
					if(e.target.className == 'avatar'){
						this.fireEvent('avatartap', index, record);
						return false;
					}
					if(e.target.className == 'up'){
						this.fireEvent('uptap', index, record);
						return false;
					}
					if(e.target.className == 'comment'){
						this.fireEvent('commenttap', index, record);
						return false;
					}
				}
			}
		}
	},

	initialize: function(){
		this.callParent(arguments);
		//在bottombar上加入下单的按钮
		var commentBtn = {
			xtype: 'button',
			text: '评论',
			cls: 'w-toolbar-button',
			iconCls: 'icon-write',
			action: 'comment',
			disabled: true
		};
		var shareButton = {
			xtype: 'button',
			text: '分享',
			cls: 'w-toolbar-button',
			iconCls: 'icon-share',
			action: 'share',
			disabled: true
		};
		
		var paiBtn = {
			xtype: 'container',
			itemId: 'paiBtn',
			cls: 'w-button-pai',
			html: '<div class="mask" id="paiMask"></div>',
			disabled: true
		};
		this.down('bottombar #buttonContainer').add(commentBtn);
		this.down('bottombar #buttonContainer').add(paiBtn);
		this.down('bottombar #buttonContainer').add(shareButton);
		//给详细内容的收起加事件
		this.down('#itemDesc').on('tap', function(){
			this.fireEvent('toggleDesc');
		}, null, {element: 'element'});
		this.down('#paiBtn').on('tap', function(){
			if(this.getDisabled()) return;
			this.fireEvent('pai');
		}, null, {element: 'element'});
		//没有评论显示的信息
		this.msgbox = WeiQuPai.Util.msgbox('还没有人评论该商品.');
		this.shareLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer', {height:160});
		this.commentForm = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', {height: 48, showAnimation: false, hideAnimation: false});
		this.add(this.msgbox);
	},

	//接收参数时调用数据
	applyParam: function(data){
		//加载数据
		this.loadData(data.id);
		//添加数据到分享功能
		this.shareLayer.setShareData(data);
		return data;
	},

	loadData: function(id){
		var auction = WeiQuPai.model.Auction;
		//这里不需要登录
		auction.getProxy().setExtraParam('token', null);
		auction.load(id, {
			scope: this,
			success: function(record, operation){
				this.setContent(record.data);
			},
			failure: function(record, operation){
				Ext.Msg.alert(null, '数据加载失败');	
			}
		});
		this.msgbox.hide();
		var store = this.getStore();
		//先清一下数据，防止别的商品的评论先出现
		store.removeAll();
		store.getProxy().setExtraParam('auction_id', id);
		store.loadPage(1, function(records, operation, success){
			if(!success){
				Ext.Msg.alert(null, '评论加载失败');
				return;
			}
			if(records.length == 0){
				this.msgbox.show();
			}
			this.down('button[action=comment]').setDisabled(false);
			this.down('button[action=share]').setDisabled(false);
		}, this);
	},

	setContent: function(data){
		//保存数据，为后面使用
		this.auctionData = data;
		this.down('detailpicshow').setPicData(data.pic_url);
		this.down('#itemTitle').setData(data);
		var desc = this.down('#itemDesc');
		desc.rawContent = data.description;
		desc.toggleState = 'short';
		data.button = '';
		if(desc.rawContent && desc.rawContent.length > 30){
			data.description = desc.rawContent.substr(0, 30) + "...";
			data.button = '<span class="show-more"></span>';
		}
		this.down('#itemDesc').setData(data);
		//如果商家没有描述就不显示商家介绍
		if(this.auctionData.shop.description){
			this.down('#shopInfo').show();
		}
		this.setButtonState();
	},

	//设置拍的按钮状态，每隔30秒检查一次
	setButtonState: function(){
		//如果view已经销毁就不做处理了
		if(this.getHidden()) return;
		this.down('#paiBtn').setDisabled(false);
		var e = Ext.get('paiMask');
		var totalHeight = 32;
		//结算中的时候就不允许拍了
		if(this.auctionData.status == 1){
			e.setHeight(totalHeight);
			return;
		}
		var me = this;
		var startTime = this.auctionData.round_start_time;
		var now = +new Date / 1000;
		var duration = this.auctionData.time_interval * 60;
		var elapsedTime = Math.min(now - startTime, duration);
		var height = 15 + Math.ceil(totalHeight * elapsedTime / duration);
		e.setHeight(height);
		if(elapsedTime == duration){
			return;
		}
		setTimeout(function(){
			me.setButtonState();
		}, 30000);
	}
});
