Ext.define('WeiQuPai.view.ShowOrder', {
    extend: 'Ext.Container',
    xtype: 'showorder',
    config: {
        picList: [],
        cls: 'shai public_14',
        scrollable: true,
        items: [{
            xtype: 'vtitlebar',
            title: '我要晒单',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            id: 'ordershai',
            tpl: new Ext.XTemplate(
                '<div class="myorder">',
                '<div class="order_dis">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" class="card-img"/>',
                '<div class="right">{item.title}</div>',
                '<div class="clear"></div>',
                '</div></div>', {
                    getCover: function(cover) {
                        return WeiQuPai.Util.getImagePath(cover, '200');
                    },
                }
            )
        }, {
            xtype: 'container',
            cls: 'camera_btn_area',
            itemId: 'cameraArea',
            items: [{
                xtype: 'button',
                baseCls: 'camera',
                action: 'showOrderCamera'
            }]
        }, {
            xtype: 'textareafield',
            placeHolder: '说说你此刻的心情',
            maxLength: 1000,
            maxRows: 4,
            name: 'content',
            cls: 'shai_content'
        }, {
            xtype: 'button',
            baseCls: 'orderdetail_btn_e7',
            action: 'publish',
            text: '确定发布'
        }]
    },

    initialize: function() {},

    applyRecord: function(record) {
        if (record == null) {
            return;
        }
        this.down('#ordershai').setData(record.data);
        return record;
    }
});