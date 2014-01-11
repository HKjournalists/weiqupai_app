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
        var prev = this.getMain().pop();
        console.log(prev.getXTypes());
        //如果是tabpanel要重置一下title
        console.log(prev.getXTypes());
        if(prev.isXType('tabpanel')){
            this.getMain().getNavigationBar().setTitle(prev.getActiveItem().title);
        }
        if(prev.isXType('circle')){
            this.getMain().getNavigationBar().show();
        }
    },

    changeTitle: function(tabPanel, tab, oldTab){
        this.getMain().getNavigationBar().setTitle(tab.title);
    },

    launch: function(){
        this.getMain().getNavigationBar().getBackButton().setCls('hidden');
    }
});
