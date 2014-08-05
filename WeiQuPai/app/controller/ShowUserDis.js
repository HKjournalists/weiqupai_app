Ext.define('WeiQuPai.controller.ShowUserDis', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showuserdis: 'showuserdis'
        },
        control: {
            showuserdis: {
                cardtap: 'productdetail',
                detailtap: 'detail',
                zantap: 'zan'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    },

    detail: function(list, index, dataItem, record, e) {

    },

    zan: function(list, index, dataItem, record, e) {

    }
});