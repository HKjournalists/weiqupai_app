Ext.define('WeiQuPai.view.Discount', {
    extend: 'Ext.Container',
    xtype: 'discount',
    requires: ['WeiQuPai.view.DiscountNormal', 'WeiQuPai.view.DiscountKillEnd'],
    config: {
        layout: 'vbox',
        items: [{
            xtype: 'vtitlebar',
            title: '惠吃惠喝',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'my_btn',
            itemId: 'tabButton',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '血战模式',
                cls: 'x-button-active',
                action: 'discountkillend'
            }, {
                flex: 1,
                xtype: 'button',
                text: '分享即得',
                action:'discountnormal'
            }]
        },{
            xtype: 'container',
            layout: 'card',
            itemId: 'mainView',
            flex: 1,
            items: [{
                xtype: 'discountkillend'
            },{
                xtype: 'discountnormal'
            }]
        }]
    },

    activeTab: null,

    initialize: function(){
        this.callParent(arguments);
        var btns = this.query('#tabButton button');
        this.activeTab = btns[0];
        var main = this.down('#mainView');
        var self = this;
        for(var i=0; i<btns.length; i++){
            btns[i].on('tap', function(btn){
                if(self.activeTab == this){
                    return;
                }
                this.addCls('x-button-active');
                main.setActiveItem(this.config.action);
                self.activeTab.removeCls('x-button-active');
                self.activeTab = this;
            });
        }
    }
});