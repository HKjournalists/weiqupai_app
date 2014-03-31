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

    //重写push/pop方法，修复多次点击会重复push/pop的问题
    push: function(){
        if(this.isAnimating) return;
        return this.callParent(arguments);
    },

    pop: function(){
        if(this.isAnimating) return;
        prev = this.callParent(arguments);
        //pop不能触发tab里view的activate事件，需要手动触发一下
        if(prev.isXType('maintab')){
            prev.getActiveItem().fireEvent('activate');
        }
        return prev;
    },

    //初始化navigation,设置动画执行的标识
    initialize: function(){
        this.callParent(arguments);
        this.addAnimation();
        this.add(Ext.create('WeiQuPai.view.MainTab'));
    },

    addAnimation: function(){
        var me = this;
        var ani = this.getLayout().getAnimation();
        ani.getInAnimation().on('animationstart', function(){
            me.isAnimating = true;
        });
        ani.on('animationend', function(){
            me.isAnimating = false;
        });
    }
});
