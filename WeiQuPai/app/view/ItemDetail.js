Ext.define('WeiQuPai.view.ItemDetail', {
	extend: 'Ext.dataview.List',
	xtype: 'itemdetail',
	requires: ['Ext.Img', 'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ItemDetailTextList', 'WeiQuPai.view.ItemDetailInfo'],
	config: {
		title: '拍品详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        pressedCls : '',
        //itemCls: 'comment-row-container',
		itemTpl: ['<div class="comment-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<p>iphone5S分辨率是多少？很多小白现在还不知道, iPhone,iphone5S分辨率是多少？</p>',
                '<p><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">2012-12-12</span></p>',
                '</div>'].join(''),
		items:[
			{
				xtype: 'carousel',
				scrollDock: 'top',
				height: 240,
				config:{
					cls: 'item-detail-pic',
					indicator: false
				}
			},
			{
				xtype: 'itemdetailtextlist'
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize : function(){
		var itemPic = this.down('carousel');
		console.log(itemPic);
		var data = [
			'pic/banner1.jpg',
			'pic/banner2.jpg'
		];
		for(var i=0; i<data.length; i++){
			var item = {
				xtype: 'image',
				src: WeiQuPai.Config.host + data[i]
			};
			itemPic.add(item);
		}
	}
});
