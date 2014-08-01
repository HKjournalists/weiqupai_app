Ext.define('WeiQuPai.view.MyOrderDetail', {
    extend: 'Ext.Container',
    xtype: 'myauctiondetail',
    requires: ['WeiQuPai.view.ShowOrder', 'WeiQuPai.view.Shipment', 'WeiQuPai.view.BottomBar'],
    config: {
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '订单详情',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'orderInfo',
            style: 'padding:0px;margin:0px',
            tpl: new Ext.XTemplate(
                '<div class="myorder_new">',
                '<div class="order_dis">',
                '<div class="left">',
                '<img src="{pic_cover}" width="50">',
                '</div>',
                '<div class="right">',
                '{title}',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>',
                '<div class="myorder" style="margin-top:-1px;">',
                '<div class="orderlist">',
                '<div class="left" style="width:100%;">',
                '<ul>',
                '<li>',
                '成交价格:<span style="color:#e76049">{price}</span>',
                '</li>',
                '<li>',
                '订单编号:{id}',
                '</li>',
                '<li>',
                '订单金额:{total_pay}',
                '</li>',
                '<li style="margin-top:10px;">',
                '电话:{consignee_info.mobile}',
                '</li>',
                '<li>',
                '地址:{consignee_info.address}',
                '</li>',
                '<li >',
                '邮编:{consignee_info.zip}',
                '</li>',
                '<li style="margin-top:10px;">',
                '配送方式:{peisong}',
                '</li>',
                '<li>',
                '支付方式:{payment}',
                '</li>',
                '<li >',
                '订单状态:{[this.getStatusText(values.status)]}',
                '</li>',
                '<li >',
                '下单时间:{ctime}',
                '</li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',

                '</div>', {
                    getStatusText: function(status) {
                        return WeiQuPai.Config.orderStatusText[status];
                    },

                    getCover: function(cover) {
                        return WeiQuPai.Util.getImagePath(cover, '290');
                    }
                }
            )
        }, {
            xtype: 'container',
            baseCls: 'orderdetail_btn',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                html: '去支付',
                baseCls: 'left'
            }, {
                xtype: 'container',
                flex: 1,
                html: '>',
                baseCls: 'right'
            }],
            id: 'pay_btn',
            hidden: true
        }, {
            xtype: 'container',
            baseCls: 'orderdetail_btn',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                html: '确认收货',
                baseCls: 'left'
            }, {
                xtype: 'container',
                flex: 1,
                html: '>',
                baseCls: 'right'
            }],
            id: 'confirm_btn',
            hidden: true
        }, {
            baseCls: 'orderdetail_btn',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                html: '查看物流',
                baseCls: 'left'
            }, {
                xtype: 'container',
                flex: 1,
                html: '>',
                baseCls: 'right'
            }],
            itemId: 'logistics',
            hidden: true
        }, {
            baseCls: 'orderdetail_btn',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                html: '我要晒单',
                baseCls: 'left'
            }, {
                xtype: 'container',
                flex: 1,
                html: '>',
                baseCls: 'right'
            }],
            itemId: 'shaidan',
            hidden: true
        }, {
            xtype: 'container',
            baseCls: 'orderdetail_btn',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                html: '退货说明',
                baseCls: 'left'
            }, {
                xtype: 'container',
                flex: 1,
                html: '>',
                baseCls: 'right'
            }]
        }]
    },

    initialize: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        //清除红点
        WeiQuPai.Notify.newOrderClear(this.getRecord().get('id'));
        WeiQuPai.Notify.orderShipClear(this.getRecord().get('id'));


        // this.down('#order_btn').add([payBtn, showBtn, confirmBtn]);
        var status = this.getRecord().get('status');
        if (status == WeiQuPai.Config.orderStatus.STATUS_TOPAY) {
            this.down('#pay_btn').show();
        } else if (status == WeiQuPai.Config.orderStatus.STATUS_TODEAL) {

        } else if (status == WeiQuPai.Config.orderStatus.STATUS_SHIPMENT) {
            this.down('#confirm_btn').show();
            his.down('#logistics').show();
        }
        if (status == WeiQuPai.Config.orderStatus.STATUS_FINISH) {
            this.down('#shaidan').show();
            this.down('#logistics').show();
        }
        var orderId = this.getRecord().get('id');
        var model = WeiQuPai.model.Order;
        model.getProxy().setExtraParam('token', user.token);
        WeiQuPai.model.Order.load(orderId, {
            scope: this,
            success: function(record, operation) {
                this.down('#orderInfo').setData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    }
});