Ext.define('WeiQuPai.view.PaymentList', {
    extend: 'Ext.Container',
    xtype: 'paymentlist',
    config:{
        layout: 'fit',
        items: [
            {
                xtype: 'list',
                itemTpl: '{title}',
                data: [
                    {
                        title: '支付宝',
                        id: 'alipay'
                    },
                    {
                        title: 'U付快捷支付',
                        id: 'umpay'
                    }
                ]
            }
        ]
    },

    show: function(){
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function(){
        WeiQuPai.Util.slideDown.call(this);
    },
});
