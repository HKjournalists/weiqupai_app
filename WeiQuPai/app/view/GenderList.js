Ext.define('WeiQuPai.view.GenderList', {
    extend: 'Ext.Container',
    xtype: 'genderlist',
    config: {
        cls: 'w-poplayer',
        items: [{
            xtype: 'dataview',
            scrollable: null,
            itemTpl: '{title}',
            baseCls: 'w-poplist',
            data: [{
                title: '男',
                id: 1
            }, {
                title: '女',
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