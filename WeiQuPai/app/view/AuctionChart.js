Ext.define('WeiQuPai.view.AuctionChart', {
    extend: 'Ext.Container',
    xtype: 'auctionchart',
    config: {
        parentCmp: null,
        auctionId: null,
        centered: true,
        modal: true,
        width: '100%',
        hideOnMaskTap: true,
        style: 'background-color:#fff',
        items: [{
            xtype: 'chart',
            height: '200px',
            store: 'AuctionRound',
            animate: true,
            //innerPadding:{top:8,right:8,bottom:8,left:8},
            interactions: ['itemhighlight'],
            legend: {},
            series: [{
                type: 'line',
                xField: 'ctime',
                yField: 'price',
                title: '价格趋势图',
                style: {
                    smooth: true,
                    stroke: '#e76049',
                    lineWidth: 3,
                    shadowColor: 'rgba(0,0,0,0.7)',
                    shadowBlur: 10,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3
                },
                highlightCfg: {
                    scale: 2
                },
                marker: {
                    type: 'circle',
                    stroke: '#CA422A',
                    fill: '#e76049',
                    lineWidth: 2,
                    radius: 4,
                    shadowColor: 'rgba(0,0,0,0.7)',
                    shadowBlur: 10,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    fx: {
                        duration: 300
                    }
                }
            }],
            axes: [{
                type: 'numeric',
                position: 'left',
                grid: {
                    odd: {
                        fill: '#fafafa'
                    }
                },
                style: {
                    axisLine: false,
                    estStepSize: 20,
                    stroke: '#ddd'
                }
            }, {
                type: 'category',
                position: 'bottom',
            }]
        }, {
            xtype: 'container',
            html: '<div class="tip"><span class="tip-btn">设置提醒价格</span></div>'
        }]
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

    applyAuctionId: function(id) {
        var store = this.down('chart').getStore();
        store.getProxy().setExtraParam('id', id);
        store.load();
        this.bindEvent();
        return id;
    },

    bindEvent: function() {
        var me = this;
        this.element.down('.tip-btn').dom.addEventListener('click', function(e) {
            me.hide();
            me.getParentCmp().fireEvent('pricetip', me.getParentCmp());
        });
    }
});