Ext.define('WeiQuPai.view.MyFriend', {
	extend: 'Ext.dataview.List',
	xtype: 'myfriend',
	requires: ['Ext.Anim'],
	config: {
		store: 'UserFriend',
		disableSelection: true,
		itemTpl: new Ext.XTemplate(
			'<div class="w-user-list-item">',
			'<img src="{avatar}">',
			'<p>{name}</p>',
			'<div class="deleteplaceholder"></div>',
			'</div>'
		),
		items:[
			{
				xtype: 'titlebar',
				title: '我的好友',
				docked: 'top'
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		this.getStore().load();
		this.on('itemswipe', function(dataview, index, dataItem, record, e){
			if(e.direction != 'left') return;
			var del = Ext.create("Ext.Button", {
				ui: "decline",
				text: "Delete",
				style: "position:absolute;right:0.125in;",
				handler: function() {
					record.stores[0].remove(record);
					record.stores[0].sync();
				}
			});
			var removeDeleteButton = function() {
				Ext.Anim.run(del, 'fade', {
					after: function() {
						del.destroy();
					},
					out: true
				});
			};
			console.log(del);
			del.renderTo(Ext.DomQuery.selectNode(".deleteplaceholder", dataItem.dom));
			dataview.on({
				single: true,
				buffer: 250,
				itemtouchstart: removeDeleteButton
			});
			dataview.element.on({
				single: true,
				buffer: 250,
				touchstart: removeDeleteButton
			});
		})

	}
});
