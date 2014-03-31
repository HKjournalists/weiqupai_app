Ext.define('WeiQuPai.view.ShowOrder', {
	extend: 'Ext.dataview.List',
	xtype: 'showorder',

	config: {
		store: 'Item',
        disableSelection : true,
		itemTpl: new Ext.XTemplate(
			'<div class="show-order-row">',
                '<img src="' + WeiQuPai.Config.host + 'pic/avatar.jpg" class="avatar"/>',
                '<div class="info">',
                '<h3>{name}</h3>',
                '<div class="pic-list">',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                	'<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                '</div>',
                '<p>这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么这里是描述么</p>',
                '<div class="flex"><div class="time">{time}</div><div class="up">100</div><div class="comment">500</div></div>',
            '</div>'
        ),
		items:[
			{
				xtype: 'panel',
				cls: 'auction-info',
				html: '<h2>{title}</h2><p>您的成交价格<span class="price">￥{price}</span></p>',
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
	},

	initialize: function(){
		this.callParent(arguments);
	}
});
