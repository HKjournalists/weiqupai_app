Ext.define('WeiQuPai.controller.SpecialSale', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'specialsale',
        },
        control: {
            pageView: {
                itemtap: 'showDetail'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goViewItem(record.get('item_id'));
    }

});