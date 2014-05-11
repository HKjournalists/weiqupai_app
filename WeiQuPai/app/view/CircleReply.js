Ext.define('WeiQuPai.view.CircleReply', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Hidden'],
	xtype: 'circlereply',
	config: {
		layout: {
			'type' : 'hbox',
			'align' : 'center'
		},
		scrollable: false,
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
		this.on('show', WeiQuPai.Util.saveLastView, this);
		this.on('show', function(){
			this.down('textfield[name=content]').focus();
		});
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
