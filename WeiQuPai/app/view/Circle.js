var circletpl = new Ext.XTemplate(
	'<div class="circle-row">',
	'<img class="avatar" user_class="{user_class}" src="' + WeiQuPai.Config.host + '{user_icon}" />',
	'<div class="circle-info">',
	'<h2>{name}</h2>',
	'{action}',
	'<tpl if="action_class == 1">',
	'<p>',
	'<tpl for="pic">',
	'<img class="pic" src="' + WeiQuPai.Config.host + '{url}" />',
	'</tpl>',
	'</p>',
	'</tpl>',
	'<p>{content}</p>',
	'<p class="time">{time}</p>',
	'</div>'
);

Ext.define('WeiQuPai.view.Circle', {
	extend: 'Ext.dataview.List',
	xtype: 'circle',
	requires: [
		'WeiQuPai.view.CircleAd', 'WeiQuPai.view.CircleDetail', 'WeiQuPai.view.ShowUser'
		],
	//requires: ['WeiQuPai.store.Circle'],

	config: {
		emtpyText: '没有拍圈信息',
		store: 'Circle',
		disableSelection : true,
		itemTpl: circletpl,
		items: [
			{
				xtype: 'circlead',
				scrollDock: 'top',
				height: '80px'
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
	}
});
