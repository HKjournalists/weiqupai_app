Ext.define('WeiQuPai.view.InputComment', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Hidden'],
	xtype: 'commentform',
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
				name: 'auction_id'
			},
			{
				xtype: 'hiddenfield',
				name: 'reply_id'
			},
			{
				xtype: 'hiddenfield',
				name: 'item_id'
			}
		]
	}, 

	initialize: function(){
		this.down('button[action=publish]').on('tap', function(){
			this.fireEvent('publishComment', this);
		}, this);

		this.down('textfield').on('keyup', function(){
	        var disabled = this.down('textfield').getValue().length == 0;
	        this.down('button[action=publish]').setDisabled(disabled);
		}, this);

		this.element.dom.addEventListener('submit', function(e){
			e.preventDefault();
		}, this);
	}
	
});
