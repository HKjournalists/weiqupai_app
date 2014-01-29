Ext.define('WeiQuPai.view.ShowOrder', {
	extend: 'Ext.dataview.List',
	xtype: 'showorder',

	config: {
		emtpyText: '没有可用的数据',
		store: 'Item',
        disableSelection : true,
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
                '<p class="time-area"><span class="up-area"><span class="up">100</span><span class="comment">500</span></span><span class="time">2012-12-12</span></p>',
                '</div>'].join(''),
		items:[
			{
        		xtype: 'titlebar',
        		title: '晒单',
        		docked: 'top'
        	},
			{
				xtype: 'panel',
				cls: 'auction-info',
				html: '<h2>Iphone 5S土豪金</h2><p>您的成交价格<span class="price">￥55.00</span></p>',
				scrollDock: 'top'
			},
			{
				xtype: 'bottombar'
			}
		], 
		listeners: {
			itemtap: function(list, index, dataItem, record, e){
				if(e.target.className == 'avatar'){
					this.fireEvent('avatartap', this, index, record);
					e.stopEvent();
				}
			}
		}
	}
});
