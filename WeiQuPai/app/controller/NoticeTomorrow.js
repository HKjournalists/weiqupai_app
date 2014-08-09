Ext.define('WeiQuPai.controller.NoticeTomorrow', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            noticetomorrow: 'noticetomorrow'
        },
        control: {
            noticetomorrow: {
                cardtap: 'showItem'
            },

        }
    },

    showItem: function(record,toUid) {
      WeiQuPai.Util.goItemView(toUid);
    }
});