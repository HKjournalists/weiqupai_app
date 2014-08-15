Ext.define('WeiQuPai.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    config: {
        layout: {
            type: 'card',
            animation: 'cover'
        },
        navigationBar: false
    },

    isAnimating: false,

    //重写push/pop方法，修复多次点击会重复push/pop的问题
    push: function() {
        if (this.isAnimating) return;
        return this.callParent(arguments);
    },

    pop: function() {
        if (this.isAnimating) return;
        prev = this.callParent(arguments);
        //pop不能触发tab里view的activate事件，需要手动触发一下
        if (prev && prev.isXType('maincard')) {
            prev.getActiveItem().fireEvent('activate');
        }
        return prev;
    },

    //初始化navigation,设置动画执行的标识
    initialize: function() {
        this.callParent(arguments);
        this.addAnimation();
        //保留引用
        WeiQuPai.mainCard = Ext.create('WeiQuPai.view.MainCard');
        WeiQuPai.sidebar = Ext.create('WeiQuPai.view.Sidebar', {
            indicator: false
        });
        this.add(WeiQuPai.mainCard);
        Ext.Viewport.add(WeiQuPai.sidebar);
        //android不触发painted事件，不知道为什么,fuck!
        if (Ext.os.is.android) {
            setTimeout(function() {
                WeiQuPai.Notify.checkMQ();
            }, 1000);
        } else {
            this.on('painted', this.onPainted, this, {
                single: true
            });
        }
    },

    //启动时检查消息要放到navaigationView初始化完成
    onPainted: function() {
        WeiQuPai.Notify.checkMQ();
    },

    addAnimation: function() {
        var me = this;
        var ani = this.getLayout().getAnimation();
        ani.getInAnimation().on('animationstart', function() {
            me.isAnimating = true;
        });
        ani.on('animationend', function() {
            me.isAnimating = false;
        });
    }
});