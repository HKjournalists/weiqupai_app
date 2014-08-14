Ext.define('WeiQuPai.view.Shipment', {
    extend: 'Ext.Container',
    xtype: 'shipment',
    config: {
        orderId: null,
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '查看物流',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'shipmentInfo',
            tpl: new Ext.XTemplate(
                '<div class="order-info">',
                '<div class="flex row"><span class="label">物流公司</span>{name}</div>',
                '<div class="flex row"><span class="label">单号</span>{shipment_id}</div>',
                '<tpl if="remark">',
                '<div class="flex row">{remark}</div>',
                '<tpl else>',
                '<ul class="shipment-progress">',
                '<tpl for="progress">',
                '<li>{desc}<p>{time}</p></li>',
                '</tpl>',
                '</ul>',
                '</tpl>',
                '</div>'
            )
        }]
    },

    initialize: function() {
       // this.msgbox = WeiQuPai.Util.msgbox('未查到对应的物流信息');
       this.msgbox = WeiQuPai.Util.msgbox('');
        this.add(this.msgbox);
    },

    applyOrderId: function(id) {
        var model = WeiQuPai.model.Shipment;
        model.load(id, {
            scope: this,
            success: function(record, operation) {
                if (record.raw.code) {
                    this.msgbox.show();
                    return;
                }
                this.down('#shipmentInfo').setData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    }
});