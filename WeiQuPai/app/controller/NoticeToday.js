Ext.define('WeiQuPai.controller.NoticeToday', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main:'main',
            noticetoday: 'noticetoday'
        },
        control: {
            noticetoday: {
                cardtap: 'showItem'
            },

        }
    },
     showItem: function(record,toUid) {
      WeiQuPai.Util.goItemView(toUid);
    }
});