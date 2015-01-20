/**
 * 优惠码输入
 */
Ext.define('WeiQuPai.view.OrderCode', {
    extend: 'Ext.form.Panel',
    xtype: 'ordercode',
    config: {
        cls: 'register',
        items: [{
            xtype: 'vtitlebar',
            title: '输入优惠码',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            name: 'vcode',
            xtype: 'textfield',
            component: {
                type: 'tel'
            },
            cls: 'w-input-text w-margin',
            placeHolder: '填写优惠码',
            autoComplete: false
        }, {
            xtype: 'button',
            text: '确定',
            baseCls: 'w-button',
            action: 'submitCode'
        }],
        code: null,
    },

    initialize: function() {
        this.down('button').on('tap', this.checkCode, this);
    },

    updateCode: function(code){
        this.down('textfield').setValue(code);
    },

    checkCode: function() {
        var code = this.down('textfield').getValue().trim();
        if (code.length == 0) {
            WeiQuPai.Util.toast('请输入优惠码');
            return;
        }
        var orderData = WeiQuPai.navigator.down('pay').getOrderData();
        var user = WeiQuPai.Cache.get('currentUser');
        var query = 'r=appv2/checkCode&code=' + code + '&auction_id=' + orderData.auction_id;
        var url = WeiQuPai.Util.apiUrl(query);
        var self = this;
        WeiQuPai.Util.get(url, function(rsp) {
            self.fireEvent('confirm', rsp);
        }, {
            mask: true
        });
    }
});