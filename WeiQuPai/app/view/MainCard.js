Ext.define('WeiQuPai.view.MainCard',
{
    extend: 'Ext.Container',
    xtype: 'maincard',
    requires: ['WeiQuPai.view.Today'],
    config:
    {
        layout:
        {
            type: 'card',
            animation: false
        },
        items: [
        {
            xtype: 'today'
        }]
    }

});