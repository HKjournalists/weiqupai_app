var companymessagetpl = new Ext.XTemplate(
	'<div class="comment-row">',
	'<p>{content}</p>',
    '<p><span class="time">{time}</span></p>',
	'</div>'
);


Ext.define('WeiQuPai.view.CompanyMessage', {
	extend: 'Ext.dataview.List',
	requires: [
		'WeiQuPai.view.CompanyTitleText',
		],
	xtype: 'companymessage',
	config: {
		id: 'showcompany',
		emtpyText: '没有信息',
		store: 'CompanyMessage',
		disableSelection : true,
		itemTpl: companymessagetpl,
		items: [
			{
        		xtype: 'titlebar',
        		title: '商家动态',
        		docked: 'top'
        	},
			{
				xtype: 'companytitletext',
				//centered: true,
				scrollDock: 'top',
				itemId: 'company-title',
				//tpl: showuserinfotpl
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	initialize: function(){
		/*var me = this;
		var getStore = Ext.data.StoreManager.lookup('ShowUserInfo');
		getStore.load(function(records, operation, success){
			if(success){
				var html = showuserinfotpl.applyTemplate(getStore.getAt(0).getData());
				me.down('#user-info').setHtml(html);
			}
		});*/
		var message = Ext.data.StoreManager.lookup('CompanyMessage');
		message.load();
	}

});
