Ext.define('WeiQuPai.controller.Pay', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            couponPanel: 'disclosureitem[itemId=coupon]',
            umpayPanel: 'disclosureitem[itemId=umpay]',
            alipayPanel: 'disclosureitem[itemId=alipay]',
            couponList: 'mycoupon',
            pageView: 'pay',
            payBtn: 'button[action=pay]'

        },
        control: {
            couponPanel: {
                tap: 'showCouponList'
            },
            paymentList: {
                itemtap: 'selectPayment'
            },
            alipayPanel: {
                tap: 'doSelectAlipay',
            },
            umpayPanel: {
                tap: 'doSelectUmpay',
            },
            payBtn: {
                tap: 'doPay'
            }
        }
    },

    showCouponList: function() {
        var view = Ext.create('WeiQuPai.view.MyCoupon', {
            selectMode: true
        });
        view.down('dataview').on('itemtap', this.selectCoupon, this);
        WeiQuPai.navigator.push(view);
    },

    //选择使用拍券
    selectCoupon: function(list, index, dataItem, record, e) {
        if (record.get('expired')) {
            Ext.toast('该拍券已经过期，不能使用');
            return;
        }
        WeiQuPai.navigator.pop();
        var order = this.getPageView().getOrderData();
        this.getCouponPanel().setContent(record.get('coupon').name);
        var curr_price = parseFloat(order.price);
        var total_pay = Math.max(0, curr_price - parseFloat(record.get('coupon').value));
        order.coupon = record.get('id');
        order.total_pay = total_pay;
        this.getPageView().down('#needPay').setContent(order.total_pay.toFixed(2), 'color_e7');
    },

    doSelectUmpay: function() {
        this.getPageView().getOrderData().payment = 'umpay';
        this.getUmpayPanel().detailNode.addCls('radio_check');
        this.getAlipayPanel().detailNode.removeCls('radio_check');
    },

    doSelectAlipay: function() {
        this.getPageView().getOrderData().payment = 'alipay';
        this.getAlipayPanel().detailNode.addCls('radio_check');
        this.getUmpayPanel().detailNode.removeCls('radio_check');
    },

    doPay: function() {
        var order = this.getPageView().getOrderData();
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + "/?r=appv2/pay&id=" + order.id + '&coupon=' + order.coupon + '&payment=' + order.payment + '&token=' + user.token;
        var win = window.open(url, '_blank', 'location=no,title=支付,closebuttoncaption=返回');
        //关闭时检查是否支付成功，如果成功跳转到订单详情
        win.addEventListener('exit', function(e) {
            win.executeScript({
                code: 'window.json',
            }, function(json) {
                if (!json || !json.success) return;
                var main = WeiQuPai.navigator;
                main.pop('maincard');
                WeiQuPai.sidebar.activeTabItem('myorder');
                WeiQuPai.mainCard.getActiveItem().loadData();
            });
        }, false);
    },
});