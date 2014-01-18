var circletpl = new Ext.XTemplate(
	'<div class="showorder-row">',
	'<img class="avatar" user_class="{user_class}" src="' + WeiQuPai.Config.host + '{user_icon}" />',
	'<div class="circle-info">',
	'<h2>{name}</h2>',
	'{action}',
	'<tpl if="action_class == 1">',
	'<p>',
	'<tpl for="pic">',
	'<img class="show-order-pic-small" src="' + WeiQuPai.Config.host + '{url}" />',
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
		'WeiQuPai.view.CircleAd', 'WeiQuPai.view.CircleDetail', 'WeiQuPai.view.ShowUser', 'WeiQuPai.view.CompanyMessage', 'WeiQuPai.view.SiteMessage'
		],
	//requires: ['WeiQuPai.store.Circle'],

	config: {
		emtpyText: '没有拍圈信息',
		store: 'Circle',
		disableSelection : true,
		itemTpl: circletpl,
		items: [
			{
				xtype: 'titlebar',
				title: '拍圈',
				docked: 'top'
			},
			{
				xtype: 'circlead',
				scrollDock: 'top',
				height: '80px'
			}
		]
	},
	
});
