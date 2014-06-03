/**
 * 今日的菜单
 */
Ext.define('WeiQuPai.view.TodayMenu', {
    extend: 'Ext.Container',
    xtype: 'todaymenu',
    config: {
        hidden: true,
        cls: 'todaymenu',
        modal: {xtype: 'mask', transparent: true},
        hideOnMaskTap: true,
        showAnimation: {
            type: 'fadeIn'
        },
        hideAnimation: {
            type: 'fadeOut'
        },
        items: [
            {
                xtype: 'spacer',
                baseCls: 'todaymenu-icon'
            }
        ]
    },

    initialize: function(){
        //this.on('hide', this.onHide, this);
    },

    clearButton: function(){
        var self = this;
        Ext.each(this.query('button'), function(btn){
            self.remove(btn);
        });
    },

    addItem: function(item){
        var btn = Ext.create('Ext.Button');
        btn.setText(item.title);
        btn.setBaseCls('todaymenu-item');
        btn.setData(item);
        btn.on('tap', this.doTap, this);
        this.add(btn);
    },

    doTap: function(btn){
        this.hide(false);
        var view = Ext.create('WeiQuPai.view.SpecialSale');
        view.setParam(btn.getData());
        Ext.Viewport.down('main').push(view);
    },

    //隐藏的时候
    onHide: function(){
        Ext.Viewport.down('today titlebar').element.down('.dropdown-title').removeCls('open');
    }
});
