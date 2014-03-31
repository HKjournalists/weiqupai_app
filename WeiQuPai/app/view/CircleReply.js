Ext.define('WeiQuPai.view.CircleReply', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Hidden'],
	xtype: 'circlereply',
	config: {
		layout: {
			'type' : 'hbox',
			'align' : 'center'
		},
		cls: 'input-comment',
		items: [
			{
				xtype: 'textfield',
				name: 'content',
				placeHolder: '评论',
				cls: 'w-input-text w-input-comment',
				clearIcon: false,
				flex: 1
			},
			{
				xtype: 'button', 
				cls: 'w-button-text',
				action: 'publish',
				text: '发送',
				disabled: true,
			},
			{
				xtype: 'hiddenfield',
				name: 'feed_id'
			},
			{
				xtype: 'hiddenfield',
				name: 'to_uid'
			},
			{
				xtype: 'hiddenfield',
				name: 'to_nick'
			}
		]
	}, 

	initialize: function(){
		this.down('button[action=publish]').on('tap', function(){
			this.fireEvent('publish', this);
		}, this);

		this.down('textfield').on('keyup', function(){
	        var disabled = this.down('textfield').getValue().length == 0;
	        this.down('button[action=publish]').setDisabled(disabled);
		}, this);
	}
	
});
