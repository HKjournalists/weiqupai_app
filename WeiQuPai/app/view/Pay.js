/**
 * 订单提交成功的支付选择页面
 *
 */

Ext.define('WeiQuPai.view.Pay', {
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.MyCoupon', 'WeiQuPai.view.PaymentList'],
    xtype: 'pay',
    config: {
        cls: 'bg_ef',
        orderData: null,
        scrollable: true,
        items: [{
            xtype: 'vtitlebar',
            title: '抢拍成功！',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            html: '请在30分钟内完成支付，不然订单会被取消哦',
            cls: 'w-tip',
            docked: 'top',
            itemId: 'tip',
            hideAnimation: {
                type: 'fadeOut'
            }
        }, {
            xtype: 'container',
            itemId: 'orderInfo',
            tpl: new Ext.XTemplate(
                '<div class="confirm">',
                '<div class="confirm_w">',
                '<div class="confirm_title">',
                '<div class="img">',
                '<img src="{[WeiQuPai.Util.getImagePath(values.pic_cover, 200)]}" width="50">',
                '</div>',
                '<div class="title">{title}</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '<div class="confirm_bottom">',
                '订单金额：<span>{price}</span>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'disclosureitem',
            title: '使用拍券',
            itemId: 'coupon',
            contentPosition: 'bottom'
        }, {
            xtype: 'disclosureitem',
            title: '还需支付',
            contentPosition: 'right',
            disclosureItem: false,
            itemId: 'needPay'
        }, {
            xtype: 'container',
            cls: 'w-disclosure-group',
            items: [{
                xtype: 'disclosureitem',
                title: '银行卡支付',
                itemId: 'umpay',
                disclosureItem: false
            }, {
                xtype: 'disclosureitem',
                title: '支付宝支付',
                itemId: 'alipay',
                disclosureItem: false
            }]
        }, {
            xtype: 'button',
            text: '去支付',
            baseCls: 'w-button',
            action: 'pay'
        }]
    },

    tipTimer: null,

    initialize: function() {
        this.down('#umpay').detailNode.addCls('radio');
        this.down('#alipay').detailNode.addCls('radio');
        this.down('#umpay').detailNode.addCls('radio_check');
        this.down('#umpay').titleNode.addCls('orderdetail_btn4');
        this.down('#alipay').titleNode.addCls('orderdetail_btn5');

        this.hideTip();
        this.on('destroy', this.onDestroy, this);;
    },

    applyOrderData: function(data) {
        this.down('#orderInfo').setData(data);
        this.down('#needPay').setContent(data.total_pay, 'color_e7');
        data.payment = 'umpay';
        return data;
    },

    hideTip: function() {
        var me = this;
        this.tipTimer = setTimeout(function() {
            me.down('#tip').hide();
        }, 30000);
    },

    onDestroy: function() {
        if (this.tipTimer) {
            clearTimeout(this.tipTimer);
            this.tipTimer = null;
        }
    }
});