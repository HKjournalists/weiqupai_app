Ext.define('WeiQuPai.view.MyOrderDetail', {
    extend: 'Ext.Container',
    xtype: 'myorderdetail',
    requires: ['WeiQuPai.view.ShowOrder', 'WeiQuPai.view.Shipment'],
    config: {
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '订单详情',
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
                '<div class="myorder_new">',
                '<div class="order_dis">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" class="card-img"/>',
                '<div class="right">{item.title}</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>',
                '<div class="orderdetail">',
                '<ul>',
                '<li><span class="value color_e7">{price}</span>成交价格</li>',
                '<li><span class="value">{id}</span>订单编号</li>',
                '<li><span class="value">{total_pay}</span>订单金额</li>',
                '</ul>',
                '<ul>',
                '<tpl if="this.isNormalItem(values.item)">',
                '<li><span class="value">{mobile}</span>电话</li>',
                '<li><span class="value">{province}{city}{address}</span>地址</li>',
                '<li><span class="value">{zip}</span>邮编</li>',
                '<li><span class="value">{delivery_time}</span>配送方式</li>',
                '<li><span class="value">{payment}</span>支付方式</li>',
                '<tpl else>',
                '<li><span class="value">{item.expire_time}</span>使用期限</li>',
                '<li><span class="value">{item.place}</span>使用地点</li>',
                '</tpl>',
                '</ul>',
                '<ul>',
                '<li><span class="value">{[this.getStatusText(values.status)]}</span>订单状态</li>',
                '<li><span class="value">{ctime}</span>下单时间</li>',
                '<li><span class="value">{comment}</span>备注</li>',
                '</ul>',
                '</div>', {
                    getStatusText: function(status) {
                        return WeiQuPai.Config.orderStatusText[status];
                    },

                    getCover: function(cover) {
                        return WeiQuPai.Util.getImagePath(cover, '200');
                    },

                    isNormalItem: function(item){
                        return item.type == 1;
                    }
                }
            )
        }, {
            xtype: 'disclosureitem',
            title: '去支付',
            itemId: 'pay_btn',
            hidden: true
        }, {
            xtype: 'disclosureitem',
            title: '确认收货',
            itemId: 'confirm_btn',
            hidden: true
        }, {
            xtype: 'disclosureitem',
            title: '查看物流',
            itemId: 'shipment_btn',
            hidden: true
        }, {
            xtype: 'disclosureitem',
            title: '我要晒单',
            itemId: 'show_order_btn',
            hidden: true
        }, {
            xtype: 'disclosureitem',
            title: '退货说明',
            itemId: 'return_btn',
            style: 'margin-bottom:10px'
        }],

        orderId: null
    },

    initialize: function() {

        this.down('#orderInfo').on('tap', function() {
            this.fireEvent('view_item');
        }, this, {
            element: 'element',
            delegate: '.order_dis'
        });

    },

    updateOrderId: function(id) {
        this.loadData();
    },

    loadData: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var orderId = this.getOrderId();
        var model = WeiQuPai.model.Order;
        var query = WeiQuPai.Util.getDefaultParam();
        model.getProxy().setExtraParams(query);
        model.load(orderId, {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
                this.updateButtonStatus();
                this.down('#orderInfo').setData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    updateButtonStatus: function() {
        var status = this.getRecord().get('status');
        var published = this.getRecord().get('published');
        this.down('#pay_btn').setHidden(status != WeiQuPai.Config.orderStatus.STATUS_TOPAY);
        this.down('#confirm_btn').setHidden(WeiQuPai.Config.orderStatus.STATUS_SHIPMENT);
        this.down('#shipment_btn').setHidden(
            status != WeiQuPai.Config.orderStatus.STATUS_SHIPMENT &&
            status != WeiQuPai.Config.orderStatus.STATUS_FINISH
        );
        this.down('#confirm_btn').setHidden(
            status != WeiQuPai.Config.orderStatus.STATUS_TODEAL &&
            status != WeiQuPai.Config.orderStatus.STATUS_SHIPMENT
        );
        this.down('#show_order_btn').setHidden(status != WeiQuPai.Config.orderStatus.STATUS_FINISH || published == 1);
    }
});