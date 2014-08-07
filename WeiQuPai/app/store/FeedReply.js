Ext.define('WeiQuPai.store.FeedReply', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'uid', 'user', 'content', 'ctime', 'to_uid', 'to_nick'],

        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/circle/view',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});