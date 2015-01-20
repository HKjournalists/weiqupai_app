Ext.define('WeiQuPai.view.ReturnAnnounce', {
    extend: 'Ext.Container',
    xtype: 'returnannounce',
    config: {
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '退货说明',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'w-content',
            html: [
                '<p>如果您对我们的货品有不满想要退货，收到货物7天内，请拨打我们的客服电话或者发邮件至我们的客服邮箱，对给您造成的不便我们深表歉意。</p>',
                '<p>退货电话：400-699-9705</p>',
                '<p>工作时间：周一至周五 9:00 - 17:30</p>',
                '<p>邮件地址：kf@vqupai.com</p>'
            ].join('')
        }]
    }

});