Ext.define('WeiQuPai.view.ShowOrder', {
	extend: 'Ext.dataview.List',
	xtype: 'showorder',

	config: {
		title: '晒单',
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
        itemCls: 'showorder-user-item',
		itemTpl: ['<div class="showorder-row">',
                '<img src="' + config.host + '{pic_url}" class="avatar"/>',
                '<div class="showorder-info">',
                '<h2><span class="time">2012-12-12 11:29</span>{name}</h2>',
                '<div class="pic-list">',
                	'<img src="' + config.host + '{pic_url}" />',
                	'<img src="' + config.host + '{pic_url}" />',
                	'<img src="' + config.host + '{pic_url}" />',
                '</div>',
                '<p>这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么</p>',
                '<p><span class="up_area">赞 100 评论 500</span></p>',
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
