Ext.define('WeiQuPai.view.KillHelp', {
    extend: 'Ext.Container',
    xtype: 'about',
    config: {
        scrollable: true,
        layout: 'vbox',
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '血战到底玩法帮助',
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
            html: '想怎么玩就怎么玩'
        }]
    }

});