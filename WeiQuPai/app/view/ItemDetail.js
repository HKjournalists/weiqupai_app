Ext.define('WeiQuPai.view.ItemDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'itemdetail',
	requires: [
		'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.DisclosureItem',
		'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Order', 'WeiQuPai.view.InputComment',
		'WeiQuPai.model.Auction'
	],
	config: {
		param: null,

		title: '拍品详情',
		emtpyText: '还没有人评论',
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
            '<h3>{nick}</h3>',
            '<p>{content}</p>',
            '<div class="flex"><div class="time">{ctime}</div><div class="up">{up_num}</div><div class="comment">{reply_num}</div></div>',
            '<tpl if="replies">',
	            '<div class="reply">',
	            	'<tpl for="replies">',
	            	'<div><span class="uname">{uname}</span>：{content}</div>',
	            	'</tpl>',
	            '</div>',
            '</tpl>',
            '</div>'
        ),
		items:[
			{
				xtype: 'titlebar',
				title: '拍品详情',
				docked: 'top'
			},
			{
				xtype: 'detailpicshow',
				scrollDock: 'top'
			},
			{
				xtype: 'container',
				scrollDock: 'top',
				itemId: 'itemTitle',
				tpl: '<h2><span class="market-price">市场价￥{mprice}</span><span class="price">￥{curr_price}</span>{title}</h2>',
				cls : 'item-detail-info'
			},
			{
				xtype: 'disclosureitem',
				title: '商家介绍',
				titleStyle: 'normal',
				itemId: 'shopInfo',
				scrollDock: 'top'
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
		var paiBtn = {
			xtype: 'button',
			text: '我拍',
			cls: 'w-toolbar-button',
			iconCls: 'icon-pai',
			action: 'order'
		};
		var commentBtn = {
			xtype: 'button',
			text: '评论',
			cls: 'w-toolbar-button',
			iconCls: 'icon-write',
			action: 'comment'
		};
		var shareButton = {
			xtype: 'button',
			text: '分享',
			cls: 'w-toolbar-button',
			iconCls: 'icon-share',
			action: 'share'
		};
		
		this.down('bottombar #buttonContainer').add(paiBtn);
		this.down('bottombar #buttonContainer').add(commentBtn);
		this.down('bottombar #buttonContainer').add(shareButton);

		//给详细内容的收起加事件
		this.down('#itemDesc').on('tap', function(){
			this.fireEvent('toggleDesc');
		}, null, {element: 'element'});
	},

	//接收参数时调用数据
	applyParam: function(data){
		//加载数据
		this.loadData(data.id);
		return data;
	},

	loadData: function(id){
		var auction = WeiQuPai.model.Auction;
		auction.load(id, {
			scope: this,
			success: function(record, operation){
				this.setContent(record.data);
			},
			failure: function(record, operation){
				Ext.Msg.alert(null, '数据加载失败');	
			}
		});
		var me = this;
		var store = this.getStore();
		//先清一下数据，防止别的商品的评论先出现
		store.removeAll();
		store.getProxy().setExtraParam('auction_id', id);
		store.load(function(records, operation, success){
			if(!success){
				Ext.Msg.alert(null, '评论加载失败');
				return;
			}
			if(records.length == 0){
				var c = Ext.create('Ext.Container', {
					scrollDock: 'top',
					html: '还没有人评论该商品.',
					cls: 'w-content',
					itemId: 'empty_comment'
				});
				me.add(c);
			}
		});
	},

	setContent: function(data){
		//保存数据，为后面使用
		this.setData(data);
		this.down('detailpicshow').setPicData(data.pic_url);
		this.down('#itemTitle').setData(data);
		var desc = this.down('#itemDesc');
		desc.rawContent = data.description;
		desc.toggleState = 'short';
		data.button = '';
		if(desc.rawContent.length > 30){
			data.description = desc.rawContent.substr(0, 30) + "...";
			data.button = '<span class="show-more"></span>';
		}
		this.down('#itemDesc').setData(data);
	}
});
