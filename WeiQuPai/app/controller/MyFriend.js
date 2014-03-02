Ext.define('WeiQuPai.controller.MyFriend', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myfriend: 'myfriend' 
    	},
        control: {
        	myfriend: {
              'itemdelete': 'doItemDelete'
            }
        }
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
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '删除失败, 请重试');
            }
        });
    },
});
