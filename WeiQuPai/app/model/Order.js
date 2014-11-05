Ext.define("WeiQuPai.model.Order", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'auction_id', 'item_id', 'price', 'item', 'auction', 'rank',
            'total_pay', 'consignee_info', 'payment', 'delivery_time', 'ctime', 'status',
            'cancel_reason', 'comment', 'coupon', 'auction_type', 'can_use_coupon'
        ],
        proxy: {
            type: 'ajax',
            reader: 'json',
            api: {
                read: WeiQuPai.Config.apiUrl + '/?r=appv2/myOrder/view',
            }
        }
    }
});