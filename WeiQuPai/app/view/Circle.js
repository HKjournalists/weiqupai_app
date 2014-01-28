var circletpl = new Ext.XTemplate(
	'<div class="circle-row">',
	'<img class="avatar" user_class="{user_class}" src="' + WeiQuPai.Config.host + '{user_icon}" />',
	'<div class="info">',
	'<h3>{name}</h3>',
	'<p>{action}</p>',
	'<tpl if="action_class == 1">',
	'<div class="pic-list">',
	'<tpl for="pic">',
	'<img src="' + WeiQuPai.Config.host + '{url}" />',
	'</tpl>',
	'</div>',
	'</tpl>',
	'<p>{content}</p>',
	'<p class="time-area"><span class="time">{time}</span></p>',
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
        itemCls: 'showorder-user-item',
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
