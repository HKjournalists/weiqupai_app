//优惠券的订单提交
Ext.define('WeiQuPai.view.CouponOrder', {
    extend: 'Ext.Container',
    xtype: 'order',
    config: {
        auctionData: null,
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '订单确认',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            html: '请在15分钟内提交订单，不然价格就变了哦',
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
                '<img src="{[WeiQuPai.Util.getImagePath(values.item.pic_cover, 200)]}" class="card-img">',
                '<div class="title">{item.title}</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '<div class="confirm_bottom">',
                '现价：{curr_price} 订单金额：<span>{total_pay}</span>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            cls: 'confirm',
            style: 'margin-top:10px;padding:10px;',
            items: [{
                xtype: 'container',
                html: '使用期限',
                cls: 'color_e7'
            }, {
                xtype: 'container',
                itemId: 'expireTime',
                tpl: new Ext.XTemplate(
                    '{item.expire_time}'
                ),
                cls: 'font_weight'
            }, {
                xtype: 'container',
                html: '使用地点',
                cls: 'color_e7'
            }, {
                xtype: 'container',
                itemId: 'place',
                tpl: new Ext.XTemplate(
                    '{item.place}'
                ),
                cls: 'font_weight'
            }]
        }, {
            xtype: 'button',
            text: '提交订单',
            baseCls: 'w-button',
            action: 'submitOrder'
        }]
    },

    tipTimer: null,

    initialize: function() {
        this.hideTip();
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user) return;
        var order = Ext.create('WeiQuPai.model.Order');
        this.setRecord(order);
        this.on('destroy', this.onDestroy, this);
    },

    hideTip: function() {
        var me = this;
        this.tipTimer = setTimeout(function() {
            me.down('#tip').hide();
        }, 30000);
    },

    applyAuctionData: function(data) {
        data.total_pay = data.total_pay || data.curr_price;
        this.getRecord().set('auction_type', data.auction_type);
        this.getRecord().set('price', data.curr_price);
        this.getRecord().set('item_id', data.item_id);
        this.getRecord().set('auction_id', data.id);
        this.getRecord().set('total_pay', data.total_pay)
        this.getRecord().set('coupon', '');
        this.getRecord().set('item', data.item);
        this.down('#orderInfo').setData(data);
        this.down('#expireTime').setData(data);
        this.down('#place').setData(data);
        return data;
    },

    onDestroy: function() {
        if (this.tipTimer) {
            clearTimeout(this.tipTimer);
            this.tipTimer = null;
        }
    }
});