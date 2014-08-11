/**
 * 专场的model
 *
 * @author icesyc
 */
Ext.define("WeiQuPai.model.SpecialSale", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'title', 'pic_url', 'description', 'start_time', 'end_time', 'status', 'shop_list', 'auctions'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/specialSale',
            reader: 'json'
        }
    }
});