Ext.define('WeiQuPai.view.ItemDesc', {
    extend: 'Ext.Container',
    xtype: 'itemdesc',
    config: {
        cls: 'discard tuwen',
        tpl: '{content}',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'spacer',
                cls: 'detail_listOne',
                flex: 1
            }]
        }]
    }
});