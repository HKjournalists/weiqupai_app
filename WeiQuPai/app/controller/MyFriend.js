Ext.define('WeiQuPai.controller.MyFriend', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myfriend: 'myfriend',
            newfriend: 'disclosureitem[itemId=newFriend]'
    	},
        control: {
        	myfriend: {
              'itemdelete': 'doItemDelete',
              'itemtap': 'doShowUser',
            },
            newfriend: {
                'tap': 'showNewFriend'
            }
        }
    },

    showUser: function(list, index, dataItem, record){
        var uid = record.get('uid');
        var view = Ext.create('WeiQuPai.view.ShowUser', {
            param: uid  
        });
        this.getMain().push(view);
    },

    showNewFriend: function(){
        var view = Ext.create('WeiQuPai.view.NewFriend');
        this.getMain().push(view);
    },

    doItemDelete: function(list, index, dataItem, record, e){
        var user = WeiQuPai.Cache.get('currentUser');
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userFriend/del&token=' + user.token,
            params: {uid: record.get('id')},
            method: 'get',
            success: function(rsp){
                WeiQuPai.Util.unmask();
                list.getStore().remove(record);
                //将本地的cache对应的id删除 
                var friends = WeiQuPai.Cache.get('friends');
                var idx = friends.indexOf(record.get('id'));
                if(idx > 0){
                    friends.splice(idx, 1);
                    WeiQuPai.Cache.set('friends', friends);
                }
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '删除失败, 请重试');
            }
        });
    }
});
