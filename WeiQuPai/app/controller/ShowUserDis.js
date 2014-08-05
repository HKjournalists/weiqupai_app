Ext.define('WeiQuPai.controller.ShowUserDis', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showuserdis: 'showuserdis'
        },
        control: {
            showuserdis: {
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