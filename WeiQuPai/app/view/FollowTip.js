Ext.define('WeiQuPai.view.FollowTip', {
    extend: 'Ext.Container',
    xtype: 'followtip',
    config: {
        centered: true,
        html: '<div class="tip-circle"><div class="tip-hand"></div></div>',
        tapAction: null
    },

    initialize: function() {
        this.element.on('tap', function(){
            this.hide();
            this.getTapAction().call(this);
        }, this);
        //点击别的地方消失
        var me = this;
        setTimeout(function(){
            Ext.Viewport.element.on('tap', function(e){
                if(!Ext.get(e.target).findParent('.tip-circle')){
                    this.hide();
                }
            }, me);
        }, 1000);
    },

    //这里为了fix红米上浮层不显示的bug，重写了show和hide的方法
    /*
    show: function() {
        this.setZIndex(1000);
        this.getModal().setZIndex(999);
        this.getModal().element.setStyle('opacity', 0);
        this.getModal().show();
        this.callParent(arguments);
    },

    hide: function() {
        this.getModal().hide();
        this.callParent(arguments);
    }
    */
});