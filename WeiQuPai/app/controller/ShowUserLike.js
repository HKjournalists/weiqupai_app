Ext.define('WeiQuPai.controller.ShowUserLike', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showuserlike: 'showuserlike'
        },
        control: {
            showuserlike: {
                itemtap: 'showItem'
            },

        }
    },

    showItem: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
});