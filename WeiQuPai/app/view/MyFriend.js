Ext.define('WeiQuPai.view.MyFriend', {
	extend: 'WeiQuPai.view.SwipeButtonList',
	requires: ['WeiQuPai.view.SwipeButtonList', 'WeiQuPai.view.NewFriend'],
	xtype: 'myfriend',
	config: {
		store: 'UserFriend',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="' + WeiQuPai.Config.host + '{avatar}" class="avatar">',
			'<p>{nick}</p>',
			'</div>',
			'<div class="button-area"><div class="swipe-button-delete">删除</div></div>'
		),
		items:[
			{
                xtype: 'titlebar',
                title: '我的好友',
                docked: 'top',
                cls: 'w-title'
            },
            {
            	xtype: 'disclosureitem',
            	cls: 'w-disclosure-item no-vpad',
            	itemId: 'newFriend',
            	titleStyle: 'normal',
            	title: '<div class="flex"><div class="icon-newfriend"><span class="x-badge" style="display:none"></span></div><div class="title">新的朋友</div></div>',
            	scrollDock: 'top'
            },
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		this.msgbox = WeiQuPai.Util.msgbox('您还没有好友.');
        this.add(this.msgbox);
		this.on('activate', this.loadData, this);
		this.on('painted', this.onPainted);
	},

	loadData: function(){
		var user = WeiQuPai.Util.checkLogin();
		if(!user) return;
		this.msgbox.hide();
		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		store.load(function(records, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if(records.length == 0){
            	this.msgbox.show();
            	return;
            }
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
            	store.removeAll();
            	return false;
            }
            friends = [];
            for(var i=0; i<records.length; i++) friends.push(records[i].get('id'));
            //更新本地的好友缓存
            WeiQuPai.Cache.set('friends', friends);
		}, this);
	},

	onPainted: function(){
		//检查是否有新消息，有显示红点
		WeiQuPai.Notify.notify(WeiQuPai.Notify.MSG_FRIEND_REQUEST);
	}
});
