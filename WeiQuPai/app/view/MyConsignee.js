Ext.define('WeiQuPai.view.MyConsignee', {
    extend: 'WeiQuPai.view.SwipeButtonList',
    xtype: 'myconsignee',
    config:{
        store: 'UserConsignee',
        title: '收货信息',
        itemTpl: new Ext.XTemplate(
            '<div class="w-list-item">',
            '<div class="content">',
            '<p>收货人：{name}</p>',
            '<p>电话：{mobile}</p>',
            '<p>地址：{province}{city}{address}</p>',
            '<p>邮编：{zip}</p>',
            '</div>',
            '</div>',
            '<div class="button-area"><div class="swipe-button-default">设为默认</div><div class="swipe-button-delete">删除</div></div>'
        ),
       
        items: [
            {
                xtype: 'titlebar',
                title: '收货信息',
                docked: 'top'
            },
            {
                xtype: 'bottombar'
            }
        ]
    },

    initialize: function(){
        this.callParent(arguments);
        this.getStore().load();
    }
});
