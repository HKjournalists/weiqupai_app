Ext.define('WeiQuPai.controller.Pay', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            couponPanel: 'disclosureitem[itemId=coupon]',
            umpayPanel: 'disclosureitem[itemId=umpay]',
            alipayPanel: 'disclosureitem[itemId=alipay]',
            codePanel: 'disclosureitem[itemId=code]',
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
            codePanel:{
              tap:'inputCode'
            },
            alipayPanel: {
                tap: 'doSelectAlipay'
            },
            umpayPanel: {
                tap: 'doSelectUmpay'
            },
            payBtn: {
                tap: 'doPay'
            }
        }
    },

    showCouponList: function() {
        //先检查是否可以使用拍券
        var data = this.getPageView().getOrderData();
        if(data.can_use_coupon == "0"){
            return WeiQuPai.Util.toast('该订单不能使用拍券');
        }

        var view = Ext.create('WeiQuPai.view.MyCoupon', {
            selectMode: true
        });
        view.down('dataview').on('itemtap', this.selectCoupon, this);
        WeiQuPai.navigator.push(view);
    },

    //选择使用拍券
    selectCoupon: function(list, index, dataItem, record, e) {
        if (record.get('expired')) {
            WeiQuPai.Util.toast('该拍券已经过期，不能使用');
            return;
        }
        WeiQuPai.navigator.pop();
        var order = this.getPageView().getOrderData();
        this.getCouponPanel().setContent(record.get('coupon').name);
        order.coupon = record.get('id');
        order.couponValue = parseFloat(record.get('coupon').value);
        this.updateNeedPay();
    },

    //更新还需支付
    updateNeedPay: function(){
        var page = this.getPageView();
        var order = page.getOrderData();
        var curr_price = parseFloat(order.price);
        var couponValue = order.couponValue || 0;
        var codeValue = order.couponCodeValue || 0;
        order.total_pay = Math.max(0, curr_price - couponValue - codeValue);
        page.down('#needPay').setContent(order.total_pay.toFixed(2), 'color_e7');
    },

    //输入优惠码 
    inputCode: function() {
        var self = this;
        var view = Ext.create('WeiQuPai.view.OrderCode');
        var order = this.getPageView().getOrderData();
        var code = order.couponCode;
        code && view.setCode(code);
        var page = this.getPageView();
        var codePanel = this.getCodePanel();
        view.on('confirm', function(rsp){
            WeiQuPai.navigator.pop();
            codePanel.setTitle('已优惠￥' + rsp.price);
            codePanel.setContent('优惠券码：' + rsp.code);
            order.couponCode = rsp.code;
            order.couponCodeValue = parseFloat(rsp.price);
            self.updateNeedPay();
        }, this);
        WeiQuPai.navigator.push(view);
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
        var query = {};
        query['r'] = 'appv2/pay';
        query['id'] = order.id;
        query['coupon'] = order.coupon || '';
        query['payment'] = order.payment;
        query['code'] = order.couponCode || '';
        var url = WeiQuPai.Util.apiUrl(query);
        var win = window.open(url, '_blank', 'location=no,title=支付,closebuttoncaption=关闭');
        //停止时检查页面是否是支付完成状态
        var paySuccess = false;
        win.addEventListener('loadstop', function(e) {
            if (e.url.indexOf('vqupai.com') == -1) return;
            win.executeScript({
                code: 'window.json',
            }, function(res) {
                if (res[0] && res[0].success) paySuccess = true;
            });
        }, false);
        //关闭时检查是否支付成功，如果成功跳转到订单详情
        win.addEventListener('exit', function(e) {
            if (!paySuccess) return;
            var main = WeiQuPai.navigator;
            main.pop('maincard');
            WeiQuPai.sidebar.activeTabItem('myorder');
            WeiQuPai.mainCard.getActiveItem().loadData();
        }, false);
    },
});