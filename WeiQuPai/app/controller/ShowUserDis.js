Ext.define('WeiQuPai.controller.ShowUserDis', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            showuserdis: 'showuserdis'
        },
        control: {
            showuserdis: {
                cardtap: 'productdetail',
                detailtap: 'showDetail',
                zantap: 'zan'
            },

        }
    },

    productdetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    },

    showDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.Comment');
        view.setCommentId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    zan: function(list, index, dataItem, record, e) {

    }
});