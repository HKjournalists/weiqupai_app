Ext.define('WeiQuPai.view.ItemParam', {
    extend: 'Ext.Container',
    xtype: 'itemparam',
    config: {
        cls: 'discard tuwen',
        style: 'min-height:180px',
        tpl: '型号：{model}<br/>规格：{specification}',
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