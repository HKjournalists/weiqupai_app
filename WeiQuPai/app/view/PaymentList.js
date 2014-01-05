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
                        title: '财富通',
                        id: 'tenpay'
                    },
                    {
                        title: '招商银行',
                        id: 'cmb'
                    },
                    {
                        title: '快钱',
                        id: '99bill'
                    }
                ]
            }
        ]
    }
});
