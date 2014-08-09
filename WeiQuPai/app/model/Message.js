Ext.define("WeiQuPai.model.Message", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'sender', 'receiver', 'content', 'ctime', 'pm_type'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/message/vew',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});