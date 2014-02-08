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
				xtype: 'container',
				cls: 'w-margin',
				layout: 'hbox',
				items: [
					{
						xtype: 'button', 
						action: 'publishComment',
						text: '发送评论',
						cls: 'w-button',
						flex: 2
					},
					{
						xtype: 'spacer',
						width: '1em'
					},
					{
						xtype: 'button', 
						action: 'closeComment',
						text: '取消',
						cls: 'w-button',
						flex: 1
					}
				]
			}
		]
	}, 

	initialize: function(){
		var me = this;
		this.down('button[action=publishComment]').on('tap', function(){
			me.fireEvent('publishComment', me);
		});
		this.down('button[action=closeComment]').on('tap', function(){
			me.hide();
		})
	}
	
});
