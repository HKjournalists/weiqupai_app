Ext.define('WeiQuPai.view.AddFriendButtonLayer', {
	extend: 'Ext.Container',
	xtype: 'addfriendbuttonlayer',
	config: {
		uid : null,
		cls: 'button-layer',
		items: [
			{
				xtype: 'button', 
				action: 'addFriend',
				text: '加好友',
				cls: 'w-button w-margin',
			},
			{
				xtype: 'button', 
				action: 'cancel',
				text: '取消',
				cls: 'w-button w-margin',
			}
		]
	},

	initialize: function(){
		this.down('button[action=cancel]').on('tap', this.hide, this);
		this.down('button[action=addFriend]').on('tap', this.doAddFriend, this);
	}, 

	doAddFriend: function(){
		this.hide();
		var user = WeiQuPai.Cache.get('currentUser');
		Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/friendRequest/request',
            method: 'post',
            params: {
                uid: this.getUid(),
                token: user.token
            },
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code && rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                Ext.Msg.alert(null, '请求已发送');
            },
            failure: function(rsp){
                Ext.Msg.Alert(null, '请求失败，请重试');
            }
        });
	}
});
