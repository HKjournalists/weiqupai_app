Ext.define('WeiQuPai.controller.Main', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            tab: 'tabpanel',
            main: 'main',
            backButton: 'bottombar button[action=back]'
        },
        control: {
           backButton:{
                tap : 'back'
           }
        }
    },
    
    back: function(){
        this.getMain().pop();
    }
});
