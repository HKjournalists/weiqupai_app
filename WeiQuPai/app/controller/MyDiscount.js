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
        if(record.get('type') == 1){
            var view = Ext.create('WeiQuPai.view.DiscountDetail');
            view.setDiscountId(record.get('discount_id'));
            view.down('button[action=getit]').hide();
            view.setDiscountRecord(record);
            WeiQuPai.navigator.push(view);
        }else if(record.get('type') == 2){ //商品类型的惠吃惠喝
            WeiQuPai.Util.goItemView(record.get('discount_id'), true);
        }
    },

    useDiscount: function(list, index, dataItem, record, e) {
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var confirmLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ConfirmLayer');
        confirmLayer.setConfirmAction(function() {
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myDiscount/use&id=' + discountId + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                record.set('used', 1);
            });
        });
        confirmLayer.show();
    },

    useDetailDiscount: function() {
        var view = WeiQuPai.navigator.getActiveItem();
        var record = view.getDiscountRecord();
        var discountId = record.get('id');
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var confirmLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ConfirmLayer');
        confirmLayer.setConfirmAction(function() {
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myDiscount/use&id=' + discountId + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                record.set('used', 1);
                view.updateDiscountRecord(record);
            });
        });
        confirmLayer.show();
    }
});