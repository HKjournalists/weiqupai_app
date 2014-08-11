Ext.define('WeiQuPai.controller.ShowUserFeed', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showuserfeed: 'showuserfeed'
        },
        control: {
            showuserfeed: {
                cardtap: 'productdetail',
                detailtap: 'showDetail'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('json_data').item_id);
    },

    showDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.Feed');
        view.setFeedId(record.get('id'));
        WeiQuPai.navigator.push(view);
    }
});