Ext.define('WeiQuPai.view.DiscountDetail', {
    extend: 'Ext.Container',
    xtype: 'discountdetail',
    config: {
        scrollable: true,
        cls: 'detail discountdetail',
        items: [{
            xtype: 'vtitlebar',
            title: '优惠详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'title',
            tpl: new Ext.XTemplate(
                '<div class="discount">',
                '<div class="left" >',
                '<img src="{[WeiQuPai.Util.getImagePath(values.pic_url)]}" width="110">',
                '</div>',
                '<div class="right">',
                '<div class="title">{title}</div>',
                '<div class="dis">{abstract}</div>',
                '<div class="time">有效期 {expire_time}</div>',
                '</div>',
                '<div class="clear"></div>',
                '</div>'
            )
        }, {
            xtype: 'button',
            baseCls: 'w-button',
            action: 'getit',
            text: '分享领取'
        }, {
            xtype: 'button',
            baseCls: 'w-button',
            action: 'useit',
            text: '使用',
            hidden: true
        }, {
            xtype: 'container',
            cls: 'one mg_10',
            itemId: 'intro',
            tpl: new Ext.XTemplate('{intro}')
        }, {
            xtype: 'container',
            cls: 'two',
            itemId: 'desc',
            tpl: new Ext.XTemplate('{description}')
        }],

        discountId: null,
        discountRecord: null
    },

    initialize: function() {},

    updateDiscountId: function(id) {
        this.loadData();
    },

    updateRecord: function(record) {
        if (record == null) {
            return;
        }
        this.down('#title').setData(record.data);
        this.down('#intro').setData(record.data);
        this.down('#desc').setData(record.data);
    },

    updateDiscountRecord: function(record) {
        if (record == null) {
            return;
        }
        var btn = this.down('button[action=useit]');
        if (record.get('used') == 1) {
            btn.setText('已使用');
            btn.setCls('disabled');
            btn.setDisabled(true);
        }
    },

    loadData: function() {
        var dis = WeiQuPai.model.Discount;
        dis.load(this.getDiscountId(), {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    }
});