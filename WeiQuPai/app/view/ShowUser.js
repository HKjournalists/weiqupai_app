var showusertpl = new Ext.XTemplate(
	'<div class="circle-row">',
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

Ext.define('WeiQuPai.view.ShowUser', {
	extend: 'Ext.dataview.List',
	xtype: 'showuser',
	requires: [],
	config: {
		emtpyText: '没有动态信息',
		store: 'ShowUser',
		disableSelection : true,
		itemTpl: showusertpl,
		items: [
			{
				xtype: 'panel',
				//centered: true,
				scrollDock: 'top',
				html: 	['<div class="user-show-top">',
						'<div class="user-show-bg">',
						'<img src="pic/ubg.jpg">',
						'</div>',
						'<div class="user-show-avatar">',
						'<img src="pic/pony.jpg" />',
						'<span class="user-show-name">Pony</span>',
						'</div>',
						'</div>'].join('')
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	initialize: function(){
		//this.down('bottombar').insert(2, {xtype: 'button', text: '去支付', action: 'pay'});
		//this.down('bottombar').insert(3, {xtype: 'spacer'});
	}

});
