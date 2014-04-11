Ext.define('WeiQuPai.view.CirclePost', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Hidden'],
	xtype: 'circlepost',
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
				placeHolder: '输入内容',
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
			}
		]
	}, 

	initialize: function(){
		this.down('button[action=publish]').on('tap', function(){
			this.fireEvent('publish', this);
		}, this);

		this.down('textfield').on('keyup', function(){
	        var disabled = this.down('textfield').getValue().trim().length == 0;
	        this.down('button[action=publish]').setDisabled(disabled);
		}, this);

		var me = this;
		this.element.dom.addEventListener('submit', function(e){
			e.preventDefault();
			if(me.down('textfield').getValue().trim().length > 0){
				me.fireEvent('publish', me);
			}
		}, this);
	}
	
});
