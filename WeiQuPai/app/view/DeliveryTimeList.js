Ext.define('WeiQuPai.view.DeliveryTimeList', {
    extend: 'Ext.Container',
    xtype: 'deliverytimelist',
    config: {
        cls: 'w-poplayer',
        items: [{
            xtype: 'dataview',
            scrollable: null,
            itemTpl: '{title}',
            baseCls: 'w-poplist',
            data: [{
                title: '周一到周五工作日',
                id: 1
            }, {
                title: '周六周日双休日',
                id: 2
            }]

        }, {
            xtype: 'button',
            text: '取消',
            action: 'cancel',
            baseCls: 'w-popbutton w-popspacer'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('dataview').on('select', function(list, record) {
            this.fireEvent('selected', list, record);
        }, this);
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },
});