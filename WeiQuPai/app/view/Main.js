Ext.define('WeiQuPai.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    requires: [
        'WeiQuPai.view.MainTab', 'WeiQuPai.view.Login', 'WeiQuPai.view.Register'
    ],
    config: {
        layout : {
            type: 'card',
            animation: 'cover'
        },
        navigationBar: false
    },

    isAnimating: false,

    forceFireActive: true,

    //重写push/pop方法，修复多次点击会重复push/pop的问题
    push: function(){
        if(this.isAnimating) return;
        return this.callParent(arguments);
    },

    pop: function(){
        if(this.isAnimating) return;
        prev = this.callParent(arguments);
        //pop不能触发tab里view的activate事件，需要手动触发一下
        //浮动菜单切换tab的时候会触发activate事件，不需要再触发
        if(prev.isXType('maintab') && this.forceFireActive){
            prev.getActiveItem().fireEvent('activate');
        }
        return prev;
    },

    //初始化navigation,设置动画执行的标识
    initialize: function(){
        this.getLayout().setAnimation(Ext.os.is.iOS ? 'cover' : null);
        this.callParent(arguments);
        this.addAnimation();
        this.add(Ext.create('WeiQuPai.view.MainTab'));
    },

    addAnimation: function(){
        var me = this;
        var ani = this.getLayout().getAnimation();
        if(!ani.id) return;
        ani.getInAnimation().on('animationstart', function(){
            me.isAnimating = true;
        });
        ani.on('animationend', function(){
            me.isAnimating = false;
        });
    }
});
