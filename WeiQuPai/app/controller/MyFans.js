Ext.define('WeiQuPai.controller.MyFans', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            myfans: 'myfans'
        },
        control: {
            myfans: {
                itemtap: 'showDetail',
            },

        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        var uid = record.get('id');
        var detailView = Ext.create('WeiQuPai.view.ShowUser', {
            uid: uid
        });
        WeiQuPai.navigator.push(detailView);
    }

});
