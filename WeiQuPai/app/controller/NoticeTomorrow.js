Ext.define('WeiQuPai.controller.NoticeToday', {
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

    showItem: function(list, index, dataItem, record, e) {
        //var record = this.getPageView().getRecord();
        console.log(record);
        // WeiQuPai.Util.goItemView(record.get('item_id'));
        WeiQuPai.Util.goItemView(record);

    }
});