Ext.define("WeiQuPai.model.UserAuction", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'pool_id', 'uid', 'item_id', 'start_price', 'curr_price', 'reserve_price',
            'status', 'status_text', 'start_time', 'left_time', 'help_num', 'left_time_text', 'item', 'user',
            'progress', 'share_text'
        ],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction',
            reader: 'json'
        }
    }
});