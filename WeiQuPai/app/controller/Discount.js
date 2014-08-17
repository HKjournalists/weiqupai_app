Ext.define('WeiQuPai.controller.Discount', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'discount',
            getBtn: 'discountdetail button[action=getit]'
        },
        control: {
            pageView: {
                showdetail: 'doShowDetail',
                getit: 'getDiscount'
            },
            getBtn: {
                tap: 'getDetailDiscount'
            }
        }
    },

    doShowDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.DiscountDetail');
        view.setDiscountId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    getDiscount: function(list, index, dataItem, record, e) {
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/discount/get&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('恭喜您成功领取了一个优惠~');
        });
    },

    getDetailDiscount: function() {
        var discountId = WeiQuPai.navigator.getActiveItem().getDiscountId();
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/discount/get&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('恭喜您成功领取了一个优惠~');
        });
    }
});