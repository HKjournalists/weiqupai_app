Ext.define("WeiQuPai.model.Order", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'auction_id', 'item_id', 'price', 'title', 'pic_cover', 'rank',
            'total_pay', 'consignee_info', 'payment', 'delivery_time', 'ctime', 'status', 'cancel_reason', 'comment', 'coupon', 'prop'
        ],
        proxy: {
            type: 'ajax',
            reader: 'json',
            api: {
                read: WeiQuPai.Config.apiUrl + '/?r=appv2/myOrder/view',
                create: WeiQuPai.Config.apiUrl + '/?r=appv2/order'
            }
        }
    }
});