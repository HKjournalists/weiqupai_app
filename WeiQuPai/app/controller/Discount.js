Ext.define('WeiQuPai.controller.Discount', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'discount'
        },
        control: {
            pageView: {
                getit: 'getDiscount'
            }
        }
    },

    getDiscount: function(list, index, dataItem, record, e) {
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/discount/get&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('恭喜您成功领取了一个优惠~');
        });
    }
});