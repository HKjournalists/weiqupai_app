Ext.define('WeiQuPai.controller.ShowUserFeed', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showuserfeed: 'showuserfeed'
        },
        control: {
            showuserfeed: {
                cardtap: 'productdetail',
                detailtap: 'detail'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('json_data').item_id);
    }
});