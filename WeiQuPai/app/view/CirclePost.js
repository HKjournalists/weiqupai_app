Ext.define('WeiQuPai.view.CirclePost', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Hidden'],
	xtype: 'circlepost',
	config: {
		cls: 'input-comment',
		items: [
			{
				xtype: 'textareafield',
				name: 'content',
				maxRows: 4,
				placeHolder: '',
				cls: 'w-input-text w-margin'
			},
			{
				xtype: 'container',
				cls: 'w-margin',
				layout: 'hbox',
				items: [
					{
						xtype: 'button', 
						action: 'closeForm',
						text: '取消',
						cls: 'w-button',
						flex: 1
					},
					{
						xtype: 'spacer',
						width: '1em'
					},
					{
						xtype: 'button', 
						action: 'publish',
						text: '发送',
						cls: 'w-button',
						disabled: true,
						flex: 2
					}
				]
			}
		]
	}, 

	initialize: function(){
		var me = this;
		this.down('button[action=publish]').on('tap', function(){
			me.fireEvent('publish', me);
		});
		this.down('button[action=closeForm]').on('tap', function(){
			me.hide();
		})
		this.down('textareafield').on('keyup', function(){
	        var disabled = this.down('textareafield').getValue().length == 0;
	        this.down('button[action=publish]').setDisabled(disabled);
		}, this);
	}
	
});
