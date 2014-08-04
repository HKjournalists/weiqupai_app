Ext.define('WeiQuPai.view.About', {
    extend: 'Ext.Container',
    xtype: 'about',
    config: {
        scrollable: true,
        layout: 'vbox',
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '关于微趣拍',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            flex: 1,
            cls: 'w-content',
            html: '关于我们'
        }]
    }

});