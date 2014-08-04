/**
 *  兑换的弹层
 *
 */
Ext.define('WeiQuPai.view.ExchangeLayer', {
    extend: 'Ext.Container',
    xtype: 'exchangelayer',
    config: {
        value: 1,
        callback: null,
        scope: null,
        cls: 'w-poplayer',
        items: [{
            xtype: 'container',
            cls: 'exchange_area',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                xtype: 'button',
                action: 'add',
                baseCls: 'exchange_btn_add',
                text: '+',
            }, {
                xtype: 'container',
                itemId: 'num',
                cls: 'exchange_input',
            }, {
                xtype: 'button',
                text: '-',
                action: 'minus',
                baseCls: 'exchange_btn_minus',
            }]
        }, {
            xtype: 'button',
            text: '确定兑换',
            action: 'exchange',
            baseCls: 'w-popbutton'
        }, {
            xtype: 'button',
            action: 'cancel',
            text: '取消',
            baseCls: 'w-popbutton w-popspacer'
        }]
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=add]').on('tap', this.increase, this);
        this.down('button[action=minus]').on('tap', this.decrease, this);
        this.down('button[action=exchange]').on('tap', this.exchange, this);
        this.down('button[action=cancel]').on('tap', this.hide, this);
    },

    applyValue: function(newValue) {
        this.down('#num').setHtml(newValue);
        return newValue;
    },

    increase: function() {
        var value = Math.min(100, this.getValue() + 1);
        this.setValue(value);
    },

    decrease: function() {
        var value = Math.max(1, this.getValue() - 1);
        this.setValue(value);
    },

    exchange: function() {
        var scope = this.getScope() || this;
        this.getCallback().call(scope, this.getValue());
    }
});