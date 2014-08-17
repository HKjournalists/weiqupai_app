Ext.define('WeiQuPai.view.AuctionChart', {
    extend: 'Ext.Container',
    xtype: 'auctionchart',
    config: {
        parentCmp: null,
        src: null,
        centered: true,
        hidden: true,
        modal: true,
        width: '100%',
        hideOnMaskTap: true,
        style: 'background:#fff;',
        tpl: new Ext.XTemplate(
            '<div class="tip-title">价格趋势</div>',
            '<img src="{img}" class="chart-img"/>',
            '<div class="tip"><span class="tip-btn">设置提醒价格</span></div>'
        ),
        showAnimation: 'popIn',
        hideAnimation: 'popOut'
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