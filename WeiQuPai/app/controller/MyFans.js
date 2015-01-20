Ext.define('WeiQuPai.controller.MyFans', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            myfans: 'myfans'
        },
        control: {
            myfans: {
                showdetail: 'showDetail',
                removefans: 'doRemoveFans'
            },

        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.User.show(record.get('id'));
    },

    doRemoveFans: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        var url = WeiQuPai.Util.apiUrl('r=appv2/follow/removeFans');
        var data = {
            id: record.get('id')
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            list.getStore().remove(record);
        });
    }

});