Ext.define('WeiQuPai.controller.NoticeToday', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            noticetoday: 'noticetoday'
        },
        control: {
            noticetoday: {
                cardtap: 'showItem'
            },

        }
    },

    showItem: function(list, index, dataItem, record, e) {
        //var record = this.getPageView().getRecord();
        console.log(record);
        // WeiQuPai.Util.goItemView(record.get('item_id'));
        WeiQuPai.Util.goItemView(record);

    }
});