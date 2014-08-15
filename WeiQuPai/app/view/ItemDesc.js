Ext.define('WeiQuPai.view.ItemDesc', {
    extend: 'Ext.Container',
    xtype: 'itemdesc',
    config: {
        cls: 'discard tuwen',
        tpl: '{description}',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                cls: 'detail_listOne',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]
    }
});