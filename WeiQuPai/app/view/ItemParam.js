Ext.define('WeiQuPai.view.ItemParam', {
    extend: 'Ext.Container',
    xtype: 'itemparam',
    config: {
        cls: 'discard',
        tpl: '{description}{description}',
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