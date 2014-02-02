Ext.define('WeiQuPai.view.InputComment', {
	extend: 'Ext.form.Panel',
	xtype: 'commentform',
	config: {
		cls: 'input-comment',
		items: [
			{
				xtype: 'textareafield',
				name: 'comment',
				maxRows: 4,
				placeHolder: '评论',
				cls: 'w-input-text w-margin'
			},
			{
				xtype: 'button', 
				action: 'publishComment',
				text: '发送评论',
				cls: 'w-button w-margin'
			}
		]
	}, 

	initialize: function(){
		var me = this;
		this.down('button[action=publishComment]').on('tap', function(){
			me.fireEvent('publishComment', me);
		});
	}
	
});
