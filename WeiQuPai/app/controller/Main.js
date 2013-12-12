Ext.define('WeiQuPai.controller.Main', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            tab: 'tabpanel',
            main: 'main'
        },
        control: {
           tab : {
               activeitemchange : 'changeTitle' 
           } 
        }
    },
    
    changeTitle: function(tabPanel, tab, oldTab){
        this.getMain().getNavigationBar().setTitle(tab.getInitialConfig().title);
    }
});
