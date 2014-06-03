Ext.define('WeiQuPai.view.NewFriend', {
	extend: 'WeiQuPai.view.SwipeButtonList',
	requires: ['WeiQuPai.view.SwipeButtonList'],
	xtype: 'newfriend',
	config: {
		store: 'FriendRequest',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="' + WeiQuPai.Config.host + '{avatar}" class="avatar">',
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
        //清除消息
        WeiQuPai.Notify.clearNotify(WeiQuPai.Notify.MSG_FRIEND_REQUEST);

		this.callParent(arguments);

		var user = WeiQuPai.Util.checkLogin();
		if(!user) return;

		this.msgbox = WeiQuPai.Util.msgbox('还没有推荐的朋友');
		this.add(this.msgbox);

		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		store.load(function(records, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if(records.length == 0){
            	this.msgbox.show();	
            	return false;
            }
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
            	store.removeAll();
            	return false;
            }
		}, this);

		this.onBefore('itemtap', function(list, index, dataItem, record, e){
			if(e.target.className == 'accept-btn'){
				this.fireEvent('itemaccept', list, index, dataItem, record, e);
				return false;
			}
		}, this);
	}
});
