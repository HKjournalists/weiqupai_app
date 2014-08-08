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

    showItem: function(list, index, dataItem, record, e) {
        //var record = this.getPageView().getRecord();
        console.log(record);
        // WeiQuPai.Util.goItemView(record.get('item_id'));
        WeiQuPai.Util.goItemView(record);

    }
});