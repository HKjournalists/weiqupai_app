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

        //上报统计
        var view = arguments[0];
        var page = view.getXTypes().split('/').pop();

        var lastView = this.getActiveItem();
        if (lastView.isXType('maincard')) {
            lastView = lastView.getActiveItem();
        }
        var from = lastView.getXTypes().split('/').pop();
        var data = {};
        data.page = page;
        data.from = from;
        //如果是系统拍卖要把item_id上报, 用户拍卖的商品在这里拿不到item_id,要在UserAuction里上报
        if (page == 'auction') {
            data.item_id = view.getRecord().get('id');
            data.auction_id = view.getRecord().get('auction').id;
        } else if (page == 'item') {
            data.item_id = view.getRecord().get('id');
        }
        if (page != 'userauction') {
            WeiQuPai.app.statReport(data);
        }

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