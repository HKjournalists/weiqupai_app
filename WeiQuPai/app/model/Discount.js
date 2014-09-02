Ext.define("WeiQuPai.model.Discount", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'title', 'pic_url', 'abstract', 'intro', 'description', 'url', 'only_once', 'expire_time', 'share_text'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/discount/view',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});