Ext.define('WeiQuPai.controller.MyDiscount', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'mydiscount'
        },
        control: {
            pageView: {
                useit: 'useDiscount'
            }
        }
    },

    useDiscount: function(list, index, dataItem, record, e) {
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myDiscount/use&id=' + discountId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            record.set('used', 1);
        });
    }
});