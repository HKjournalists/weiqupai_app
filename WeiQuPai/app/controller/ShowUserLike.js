Ext.define('WeiQuPai.controller.ShowUserLike', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showuserlike: 'showuserlike'
        },
        control: {
            showuserlike: {
                itemtap: 'showperson'
            },

        }
    },

    showperson: function(list, index, dataItem, record, e) {

        // var uid = record.get('item_id');
        // var detailView = Ext.create('WeiQuPai.view.ItemDetail', {
        //     id: uid
        // });
        // console.log(record);
        // WeiQuPai.navigator.push(detailView);
        var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam(record.data);
        //console.log(record);
        WeiQuPai.navigator.push(detailView);
    }
});