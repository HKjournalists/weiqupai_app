Ext.define('WeiQuPai.view.CircleDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'circledetail',
	requires: ['WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ItemDetailTextList',
	 'WeiQuPai.view.ItemDetailInfo', 'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Pay'],
	config: {
		title: '拍品详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        pressedCls : '',
		itemTpl: ['<div class="user-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<p>iphone5S分辨率是多少？很多小白现在还不知道, iPhone,iphone5S分辨率是多少？</p>',
                '<p class="time-area"><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">2012-12-12</span></p>',
                '</div>'].join(''),
		items:[
			{
				xtype: 'detailpicshow',
				scrollDock: 'top'
			},
			{
				xtype: 'panel',
				scrollDock: 'top',
				html: '<h2><span class="market-price">市场价￥66</span><span class="price">￥55.00</span>Suit椅</h2>',
				cls : 'item-detail-info'
			},
			{
				xtype: 'itemdetailtextlist',
				scrollDock: 'top'
			},
			{
				xtype: 'bottombar'
			}
		]
	},
	initialize: function(){
		//在bottombar上加入下单的按钮
		var paiBtn = {
			xtype: 'button',
			text: '我要拍',
			action: 'pay'
		}
		var commentBtn = {
			xtype: 'button',
			text: '写评论',
			action: 'comment'
		}
		this.down('bottombar').insert(2, paiBtn);
		this.down('bottombar').insert(3, {xtype:'spacer'});
		this.down('bottombar').insert(4, commentBtn);
		this.down('bottombar').insert(5, {xtype:'spacer'});
	}
});
