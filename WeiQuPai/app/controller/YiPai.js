Ext.define('WeiQuPai.controller.YiPai', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            yipai: 'yipai'
        },
        control: {
            yipai: {
                cardtap: 'productdetail',
                persontap: 'persondetail'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item').id);
    },
    persondetail: function(list, index, dataItem, record, e) {
        var uid = record.get('auctions')[index].uid;
        console.log(record.get('auctions')[index]);
        var detailView = Ext.create('WeiQuPai.view.ShowUser', {
            uid: uid
        });
        WeiQuPai.navigator.push(detailView);
    }
});