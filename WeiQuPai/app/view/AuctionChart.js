Ext.define('WeiQuPai.view.AuctionChart', {
    extend: 'Ext.Container',
    xtype: 'auctionchart',
    config: {
        parentCmp: null,
        src: null,
        centered: true,
        modal: true,
        width: '100%',
        hideOnMaskTap: true,
        style: 'background-color:#fff',
        tpl: new Ext.XTemplate(
            '<div class="tip-title">价格趋势</div>',
            '<img src="{img}" class="chart-img"/>',
            '<div class="tip"><span class="tip-btn">设置提醒价格</span></div>'
        )
    },

    initialize: function() {},

    //这里为了fix红米上浮层不显示的bug，重写了show和hide的方法
    show: function() {
        this.setZIndex(1000);
        this.getModal().setZIndex(999);
        this.getModal().show();
        Ext.Anim.run(this.element, 'pop', {
            out: false,
            autoClear: false
        });
    },

    hide: function() {
        this.getModal().hide();
        Ext.Anim.run(this.element, 'pop', {
            out: true,
            autoClear: false
        });
    },

    applySrc: function(src) {
        var d = {
            img: src
        }
        this.setData(d);
        this.bindEvent();
    },

    bindEvent: function() {
        var me = this;
        this.element.down('.tip-btn').dom.addEventListener('click', function(e) {
            me.hide();
            me.getParentCmp().fireEvent('pricetip', me.getParentCmp());
        });
    }
});