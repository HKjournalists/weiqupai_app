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

    show: function(){
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function(){
        WeiQuPai.Util.slideDown.call(this);
    },
    
	initialize: function(){
		this.on('show', WeiQuPai.Util.saveLastView, this);
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
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
                if(rsp.code && rsp.code > 0){
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                WeiQuPai.Util.toast('请求已发送');
            },
            failure: function(rsp){
                WeiQuPai.Util.toast('请求失败，请重试');
            }
        });
	}
});
