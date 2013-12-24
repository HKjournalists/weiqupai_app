Ext.define('WeiQuPai.controller.Main', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            tab: 'tabpanel',
            main: 'main',
            backButton: 'bottombar button[action=back]'
        },
        control: {
           tab : {
                activeitemchange : 'changeTitle' 
           },
           backButton:{
                tap : 'back'
           }
        }
    },
    

    back: function(){
        this.getMain().pop();
    },

    changeTitle: function(tabPanel, tab, oldTab){
        this.getMain().getNavigationBar().setTitle(tab.getInitialConfig().title);
    },

    launch: function(){
        this.getMain().getNavigationBar().getBackButton().setCls('hidden');
    }
});
