Ext.define('WeiQuPai.controller.NoticeAfter', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            noticeafter: 'noticeafter'
        },
        control: {
            noticeafter: {
                cardtap: 'showItem'
            },

        }
    },

    showItem: function(record,toUid) {
      WeiQuPai.Util.goItemView(toUid);
    }
});