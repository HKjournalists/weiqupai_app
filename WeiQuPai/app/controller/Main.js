Ext.define('WeiQuPai.controller.Main', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            backButton: 'button[action=back]'
        },
        control: {
           backButton:{
                tap : 'goBack'
           }
        }
    },
    
    goBack: function(){
        this.getMain().pop();
    }
});
