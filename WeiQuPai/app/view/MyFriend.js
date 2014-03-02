Ext.define('WeiQuPai.view.MyFriend', {
	extend: 'WeiQuPai.view.SwipeButtonList',
	requires: ['WeiQuPai.view.SwipeButtonList'],
	xtype: 'myfriend',
	config: {
		store: 'UserFriend',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="{avatar}" class="avatar">',
			'<p>{nick}</p>',
			'</div>',
			'<div class="button-area"><div class="swipe-button-delete">删除</div></div>'
		),
		items:[
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		var user = WeiQuPai.Cache.get('currentUser');
		if(!user) return;
		this.callParent(arguments);
		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		this.getStore().load(function(data, operation, success){
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
            }
		});
	}
});
