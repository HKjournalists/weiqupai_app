Ext.define('WeiQuPai.view.MainCard', {
    extend: 'Ext.Container',
    xtype: 'maincard',
    config: {
        layout: {
            type: 'card',
            animation: null
        },
        items: [{
            xtype: 'today'
        }]
    },
    initialize: function() {

    }

});