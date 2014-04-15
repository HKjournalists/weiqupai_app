Ext.define('WeiQuPai.controller.MyAuctionDetail', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            pageView: 'myauctiondetail',
            shipment: 'myauctiondetail disclosureitem[itemId=shipment]',
            payBtn: 'myauctiondetail button[action=pay]',
            showBtn: 'myauctiondetail button[action=showOrder]',
            confirmBtn: 'myauctiondetail button[action=confirm]'
        },
        control: {
            payBtn: {
                tap: 'doPay'
            },
            showBtn: {
                tap: 'doShowOrder'
            },
            confirmBtn: {
                tap: 'doConfirm'
            },
            shipment: {
                tap: 'doShowShipment',
            }

        }
    },

    doPay: function(){
        var data = this.getPageView().getRecord().data;
        var payment = data.payment;
        var orderId = data.id;
        WeiQuPai.Util.forward('pay', {orderId:orderId, payment:payment});
    },

    doConfirm: function(){
        var func = function(buttonId){
            if(buttonId != 'yes') return;
            var data = this.getPageView().getRecord().data;
            var user = WeiQuPai.Cache.get('currentUser');
            var self = this;
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=app/userAuction/confirm',
                params: {id: data.id, token: user.token},
                method: 'get',
                success: function(rsp){
                    rsp = Ext.decode(rsp.responseText);
                    if(rsp.code && rsp.code > 0){
                        Ext.Msg.alert(null, '数据更新失败');
                        return;
                    }
                    Ext.Msg.alert(null, '您已成功确认收货');
                    self.getConfirmBtn().hide();
                    Ext.get('statusText').setHtml('已完成');
                },
                failure: function(){
                    Ext.Msg.alert(null, '数据更新失败');
                }
            });
        };
        Ext.Msg.confirm(null, '确认收货吗？', func, this);
    },

    doShowOrder: function(){
        Ext.Msg.alert(null, '秀！');
    },

    doShowShipment: function(){
        var data = this.getPageView().getRecord().data;
        var orderId = data.id;
        WeiQuPai.Util.forward('shipment', {orderId:orderId});;
    }
});
