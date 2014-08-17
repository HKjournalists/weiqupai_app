Ext.define('WeiQuPai.controller.MyDiscount', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'mydiscount',
            useBtn: 'discountdetail button[action=useit]'
        },
        control: {
            pageView: {
                useit: 'useDiscount',
                showdetail: 'doShowDetail'
            },
            useBtn: {
                tap: 'useDetailDiscount'
            }
        }
    },

    doShowDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.DiscountDetail');
        view.setDiscountId(record.get('discount_id'));
        view.down('button[action=getit]').hide();
        view.down('button[action=useit]').show();
        view.setDiscountRecord(record);
        WeiQuPai.navigator.push(view);
    },

    useDiscount: function(list, index, dataItem, record, e) {
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myDiscount/use&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            record.set('used', 1);
        });
    },

    useDetailDiscount: function() {
        var view = WeiQuPai.navigator.getActiveItem();
        var record = view.getDiscountRecord();
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myDiscount/use&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            record.set('used', 1);
            view.updateDiscountRecord(record);
        });
    }
});