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
    persondetail: function(list, index, record, toUid) {
       var uid = toUid;
       // console.log(record+"+"+toUid);
        var detailView = Ext.create('WeiQuPai.view.ShowUser', {
            uid: uid
        });
        WeiQuPai.navigator.push(detailView);
    }
});