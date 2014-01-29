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
                tap : 'goBack'
           },
           main: {
                initialize: 'initMain'
           }
        }
    },
    
    isAnimating : false,

    goBack: function(){
        if(this.getMain().isAnimating) return;
        this.getMain().pop();
    },

    initMain : function(me){
        var ani = me.getLayout().getAnimation();
        ani.getInAnimation().on('animationstart', function(){
            me.isAnimating = true;
        });
        ani.on('animationend', function(){
            me.isAnimating = false;
        });
    }
});
