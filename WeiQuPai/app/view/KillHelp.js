Ext.define('WeiQuPai.view.KillHelp', {
    extend: 'Ext.Container',
    xtype: 'about',
    config: {
        scrollable: true,
        layout: 'vbox',
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
            style: 'padding:10px',
            html: '<img src="resources/images/kill_help.png" style="min-width:100%;max-width:100%"/>'
        }]
    }

});