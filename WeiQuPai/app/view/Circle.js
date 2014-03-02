/**
 * 拍圈的视图
 *
**/

Ext.define('WeiQuPai.view.Circle', {
	extend: 'Ext.dataview.List',
	xtype: 'circle',
	requires: [
		'WeiQuPai.view.Banner', 'WeiQuPai.view.ShowUser', 'WeiQuPai.view.CompanyMessage', 'WeiQuPai.view.SiteMessage'
	],
	config: {
		emtpyText: '没有拍圈信息',
		loadingText: '加载中...',
		store: 'Circle',
		disableSelection : true,
		itemTpl: new Ext.XTemplate(
			'<div class="circle-row">',
			'<img class="avatar" user_class="{user_class}" src="' + WeiQuPai.Config.host + '{avatar}" />',
			'<div class="info">',
			'<h3>{nick}<span class="action">{action}</span></h3>',
			'<tpl if="action_class == 1">',
			'<div class="pic-list">',
			'<tpl for="pic">',
			'<img src="' + WeiQuPai.Config.host + '{.}" />',
			'</tpl>',
			'</div>',
			'</tpl>',
			'<p>{content}</p>',
			'<p class="flex"><span class="time">{time}</span></p>',
			'</div>'
		),
		items: [
			{
				xtype: 'banner',
				scrollDock: 'top'
			}
		], 

		listeners: {
			itemtap: {
				order: 'before',
				fn: function(list, index, dataItem, record, e){
					if(e.target.className == 'avatar'){
						this.fireEvent('avatartap', this, index, record);
						return false;
					}
				}
			}
		}
	},

	initialize: function(){
		this.callParent(arguments);
		this.getStore().load();
	}
});
