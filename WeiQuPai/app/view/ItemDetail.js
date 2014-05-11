Ext.define('WeiQuPai.view.ItemDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'itemdetail',
	requires: [
		'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.DisclosureItem',
		'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Order', 'WeiQuPai.model.Auction',
		'WeiQuPai.view.ShareLayer','WeiQuPai.view.Brand', 'WeiQuPai.model.Reserve'
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
            	xtype: 'container',
            	docked: 'top',
            	itemId: 'countdown',
            	tpl: new Ext.XTemplate(
            		'<div class="countdown-bar {[this.statusCss(values.status)]}">',
            		'<div class="round">{[this.formatRound(values)]}</div>',
            		'<div class="countdown" id="countdown">{[this.formatCountdown(values)]}</div>',
            		'<div class="price"><span class="curprice">{[this.formatPrice(values)]}</span><br/><span class="oprice">{oprice}</span>',
            		'</div>',
					{
						statusCss: function(status){
							var css = {};
							css[WeiQuPai.Config.auctionStatus.STATUS_NOT_START] = 'not-start';
							css[WeiQuPai.Config.auctionStatus.STATUS_ONLINE] = 'online';
							css[WeiQuPai.Config.auctionStatus.STATUS_FINISH] = 'finish';
							return css[status];
						},

						formatRound: function(values){
							if(values.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START){
								return '未开始';
							}	
							else if(values.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH){
								return '已结束';
							}
							return '第' + values.curr_round + '轮';
						},

						formatPrice: function(values){
							var auctions = WeiQuPai.Cache.get('auctions');
		            		if(auctions && auctions.indexOf(values.id) != -1){
		            			return '已拍';
		            		}
		            		return '￥' + values.curr_price;
						},

						formatCountdown: function(values){
							if(values.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START){
								return values.start_time;
							}	
							else if(values.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH){
								return '00:00';
							}
							else{
								var sec = values.left_time % 60;
								var min = (values.left_time - sec) / 60;
								var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
								return countdown;
							}
						}
					}
				),
            },
			{
				xtype: 'detailpicshow',
				scrollDock: 'top'
			},
			{
				xtype: 'container',
				scrollDock: 'top',
				itemId: 'itemTitle',
				tpl: new Ext.XTemplate('<h2>{title}</h2>'),				
				cls : 'item-detail-title'
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
				xtype: 'disclosureitem',
				title: '品牌介绍',
				titleStyle: 'normal',
				itemId: 'brandInfo',
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

	refreshTimer: null,
	counterTimer: null,
	//未开始时为还有多少时间开始，拍卖中时为本轮剩余时间
	leftSeconds: 0,

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
			html: '<div class="mask" id="paiBtnMask"></div>',
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
		//销毁的时候结束定时器
		this.on('destroy', this.onDestroy);
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
				//添加数据到分享功能
				this.shareLayer.setShareData(record.data);
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
			this.down('#paiBtn').setDisabled(false);
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
		this.down('#countdown').setData(data);

		if(this.auctionData.shop){
			this.down('#shopInfo').show();
		}
		if(this.auctionData.brand){
			this.down('#brandInfo').show();
		}
		if(this.auctionData.status != WeiQuPai.Config.auctionStatus.STATUS_ONLINE){
			console.log(this.auctionData.status);
			Ext.get('paiBtnMask').setStyle('display', 'block');
		}
		//设置提示浮层
		this.setTipMasker();
		this.setCountdown();
	},

	setTipMasker: function(){
		if(!WeiQuPai.app.firstLaunch || window['tipmask']) return;
		//动画如果没切换完就等待
		if(Ext.Viewport.down('main').isAnimating){
			return setTimeout(Ext.bind(arguments.callee, this), 200);
		}
		window['tipmask'] = true;
		var config = [
			{
				top: 0,
				width: '100%',
				height:136,
	            src: 'resources/images/tip1.png'
        	},
			{
				bottom: 0,
				width: '100%',
				height:90,
	            src: 'resources/images/tip2.png'
        	},
			{
				top: '60%',
				centered: true,
				width: '100%',
				height:40,
	            src: 'resources/images/tip3.png'
        	}
        ];
        var container = Ext.create('Ext.Container', {top:0,left:0,modal:{style:"background:rgba(0,0,0,0.65)"}, width:'100%', height: '100%'});
        for(var i=0; i<config.length; i++){
	        var img = Ext.create('Ext.Img', config[i]);
	        container.add(img);
        }
        container.on('tap', function(){
        	container.destroy();
        }, this, {element: 'element'});
        Ext.Viewport.add(container);
	},

	//软刷新
	softRefresh: function(){
		//先确保清空定时器
		this.onDestroy();
		Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/auction/refresh&id=' + this.auctionData.id,
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                this.auctionData.left_time = rsp.left_time;
                this.auctionData.status = rsp.status;
                this.auctionData.curr_round = rsp.curr_round;
                this.auctionData.curr_price = rsp.curr_price;
                this.auctionData.round_start_time = rsp.round_start_time;
                this.down('#countdown').setData(this.auctionData);
                //如果没结束就继续自动刷新
                if(rsp.status != WeiQuPai.Config.auctionStatus.STATUS_FINISH){
                	Ext.get('paiBtnMask').setStyle('display', 'none');	
                	this.setCountdown();
                }else{
                	Ext.get('paiBtnMask').setStyle('display', 'block');
                }
            },
            scope: this
        });
	},

	//设置定时器
	setCountdown: function(){
		var now = Math.ceil(new Date / 1000);
		this.leftSeconds = this.auctionData.left_time;
		if(this.leftSeconds <= 0 || this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) return;
		var me = this;
		//如果是未开始，在开始时间做软刷新
		if(this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START){
			this.refreshTimer = setTimeout(function(){
				me.softRefresh();
			}, this.leftSeconds * 1000);
			return;
		}
		//已经开始的做计时
		this.counterTimer = setInterval(function(){
			me.countdown();
		}, 1000);
	},

	countdown: function(){
		//计时结束做下一轮刷新
		if(this.leftSeconds == 0){
			clearInterval(this.counterTimer);
			this.counterTimer = null;
			return this.softRefresh();
		}
		this.leftSeconds--;
		var sec = this.leftSeconds % 60;
		var min = (this.leftSeconds - sec) / 60;
		var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
		Ext.get('countdown').setHtml(countdown);
		var me = this;
		if(this.leftSeconds <= 6 && this.leftSeconds > 0){
			setTimeout(function(){
				me.flashBackground();
			}, 700);
		}
	},

	flashBackground: function(){
		var me = this;
		var el = Ext.get('countdown');
		var outAnim = Ext.create('Ext.Anim',{
			autoClear: false,
			from:{'background':'#ca0936'},
			to: {'background':'#f0f0f1'},
			duration: 200,
			after: function(){
				inAnim.run(el);
			}
		});
		var inAnim = Ext.create('Ext.Anim', {
			autoClear: false,
			from:{'background':'#f0f0f1'},
			to: {'background':'#ca0936'},
			duration: 600
		});
		outAnim.run(el);
	},

	//销毁的时候清除定时器
	onDestroy: function(){
		if(this.refreshTimer){
			clearTimeout(this.refreshTimer);
			this.refreshTimer = null;
		}
		if(this.counterTimer){
			clearInterval(this.counterTimer);
			this.counterTimer = null;
		}
	}
});
