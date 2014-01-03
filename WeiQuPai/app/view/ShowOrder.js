Ext.define('WeiQuPai.view.ShowOrder', {
	extend: 'Ext.dataview.List',
	xtype: 'showorder',

	config: {
		title: '晒单',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        itemCls: 'showorder-user-item'	,
		itemTpl: ['<div class="showorder-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<div class="pic-list">',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                '</div>',
                '<p>这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么</p>',
                '<p><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">2012-12-12</span></p>',
                '</div>'].join(''),
		items:[
			{
				xtype: 'panel',
				cls: 'auction-info',
				html: '<h2>Iphone 5S土豪金</h2><p>您的成交价格<span class="price">￥55.00</span></p>',
				scrollDock: 'top',
			},
			{
				xtype: 'bottombar'
			}
		],
	}
});
