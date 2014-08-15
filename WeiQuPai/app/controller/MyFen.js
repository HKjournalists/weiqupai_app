Ext.define('WeiQuPai.controller.MyFen', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            myfen: 'myfen'
        },
        control: {
            myfen: {
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