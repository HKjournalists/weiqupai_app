Ext.define('WeiQuPai.controller.Shop', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            tab: 'tabpanel',
            main: 'main',
            linkButton: 'button[action=jumpUrl]'
        },
        control: {
           linkButton: {
                tap: 'jumpUrl'
           }
        }
    },
    
    jumpUrl: function(btn){
        window.open(btn.url, '_system');
    }
});
