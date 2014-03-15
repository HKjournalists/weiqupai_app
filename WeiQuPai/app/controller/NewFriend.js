Ext.define('WeiQuPai.controller.NewFriend', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myfriend: 'myfriend',
            newfriend: 'newfriend'
    	},
        control: {
        	newfriend: {
              'itemdelete': 'doItemDelete',
              'itemaccept': 'doItemAccept'
            }
        }
    },

    doItemDelete: function(list, index, dataItem, record, e){
        var user = WeiQuPai.Cache.get('currentUser');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/friendRequest/del',
            params: {id: record.get('id'), token: user.token},
            method: 'get',
            success: function(rsp){
                list.getStore().remove(record);
            },
            failure: function(rsp){
                Ext.Msg.alert(null, '删除失败, 请重试');
            }
        });
    },

    doItemAccept: function(list, index, dataItem, record, e){
        var user = WeiQuPai.Cache.get('currentUser');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/friendRequest/accept',
            params: {id: record.get('id'), token: user.token},
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                record.set('status', rsp.status);
                //将好友的id保存到本地cache中
                var friends = WeiQuPai.Cache.get('friends') || [];
                friends.push(record.get('request_uid'));
                WeiQuPai.Cache.set('friends', friends);
            },
            failure: function(rsp){
                Ext.Msg.alert(null, '请求失败, 请重试');
            }
        });
    }
});
