Ext.define('WeiQuPai.controller.ShowUserFeed', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showuserfeed: 'showuserfeed'
        },
        control: {
            showuserfeed: {
                protap: 'productdetail',
                detailtap: 'detail'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam(record.data);
        WeiQuPai.navigator.push(detailView);
    }
});