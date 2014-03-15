Ext.define('WeiQuPai.view.NewFriend', {
	extend: 'WeiQuPai.view.SwipeButtonList',
	requires: ['WeiQuPai.view.SwipeButtonList'],
	xtype: 'newfriend',
	config: {
		store: 'FriendRequest',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="{avatar}" class="avatar">',
			'<p>{nick}</p>',
			'<tpl if="status==0">',
				'<span class="accept-btn">接受</span>',
			'<tpl else>',
				'<span class="accept-text">已添加</span>',
			'</tpl>',
			'</div>',
			'<div class="button-area"><div class="swipe-button-delete">删除</div></div>'
		),
		items:[
			{
                xtype: 'titlebar',
                title: '新的朋友',
                docked: 'top',
                cls: 'w-title'
            },
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
		var me = this;
		this.getStore().load(function(data, operation, success){
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
                return;
            }
            if(data.length == 0){
            	var c = WeiQuPai.Util.msgbox('还没有推荐的朋友', {
					scrollDock: 'top',
				});
				me.add(c);
            }
		});
		this.onBefore('itemtap', function(list, index, dataItem, record, e){
			if(e.target.className == 'accept-btn'){
				this.fireEvent('itemaccept', list, index, dataItem, record, e);
				return false;
			}
		}, this);
	}
});
