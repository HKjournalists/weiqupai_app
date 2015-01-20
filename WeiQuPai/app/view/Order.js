Ext.define('WeiQuPai.view.Order', {
    extend: 'Ext.Container',
    xtype: 'order',
    requires: ['WeiQuPai.view.DeliveryTimeList', 'WeiQuPai.view.MyConsignee'],
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
            xtype: 'disclosureitem',
            itemId: 'consignee',
            title: '收货信息',
            contentPosition: 'bottom'
        }, {
            xtype: 'disclosureitem',
            itemId: 'delivery_time',
            title: '配送时间',
            contentPosition: 'bottom'
        }, {
            xtype: 'textareafield',
            placeHolder: '如果商品为多色，请备注您希望购买的颜色',
            maxLength: 100,
            name: 'comment',
            cls: 'order_comment',
            clearIcon: false
        }, {
            xtype: 'button',
            text: '提交订单',
            baseCls: 'w-button',
            action: 'submitOrder'
        }]
    },


    consigneeTpl: new Ext.XTemplate(
        '<div><b>{name} {mobile}</b></div>',
        '<div>{province}{city}{address}</div>'
    ),


    initialize: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user) return;
        var order = Ext.create('WeiQuPai.model.Order');
        this.setRecord(order);
        this.addDeliveryTime();

        //加载默认收货地址
        var consignee = Ext.getStore('MyConsignee');
        var query = WeiQuPai.Util.getDefaultParam();
        consignee.getProxy().setExtraParams(query);
        consignee.load(function(records, operation, success) {
            if (!success) return;
            var dft = consignee.findRecord('is_default', 1, 0, null, null, true);
            if (dft) {
                this.getRecord().set('consignee_id', dft.get('id'));
                var html = this.consigneeTpl.apply(dft.getData());
                this.down('#consignee').setContent(html);
            }
        }, this);
        this.on('destroy', this.onDestroy, this);
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
        return data;
    },

    addDeliveryTime: function() {
        var deliveryTimeView = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeliveryTimeList');
        this.selectFirst('delivery_time', deliveryTimeView.down('dataview'));
    },

    selectFirst: function(itemId, list) {
        list.select(0);
        var title = list.getSelection()[0].get('title');
        this.getRecord().set(itemId, title);
        this.down('disclosureitem[itemId=' + itemId + ']').setContent(title);
    },

    onDestroy: function() {
        if (this.tipTimer) {
            clearTimeout(this.tipTimer);
            this.tipTimer = null;
        }
    }
});