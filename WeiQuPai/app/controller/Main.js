Ext.define('WeiQuPai.controller.Main', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            backButton: 'button[action=back]',
            menuButton: 'button[action=menu]',
            submenuToday: 'button[action=today]',
            submenuMyauction: 'button[action=myauction]',
            submenuCircle: 'button[action=circle]',
            submenuMy: 'button[action=my]',

        },
        control: {
           backButton:{
                tap : 'goBack'
           },
           menuButton:{
                tap : 'showMenu'
           },
           submenuToday:{
                tap: 'showMainTab'
           },
           submenuMyauction:{
                tap: 'showMainTab'
           },
           submenuCircle:{
                tap: 'showMainTab'
           },
           submenuMy:{
                tap: 'showMainTab'
           }
        }
    },
   
    menu: null,

    goBack: function(){
        this.getMain().pop();
    },

    showMenu: function(btn){
        if(!this.menu){
            this.menu = Ext.create('WeiQuPai.view.SubMenu');
        }
        this.menu.showBy(btn);
    },

    showMainTab: function(btn){
        this.menu.hide();
        var tab = this.getMain().down(btn.config.action);
        main = this.getMain().down('maintab');
        main.setActiveItem(tab);
        this.getMain().setActiveItem(main);
    }
});
