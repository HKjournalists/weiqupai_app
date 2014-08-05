Ext.define('WeiQuPai.controller.MyAuction', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'myauction',
        },
        control: {
            pageView: {
                itemtap: 'showDetail',
                order_item: 'goOrder'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    },

    goOrder: function(list, index, dataItem, record, e) {
        var payment = record.get('payment');
        var orderId = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + "/?r=app/pay&id=" + orderId + '&token=' + user.token;
        window.open(url, '_blank', 'location=no,title=支付,closebuttoncaption=返回');
    }
});