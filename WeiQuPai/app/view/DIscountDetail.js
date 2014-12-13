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

    initialize: function() {
        this.element.onBefore('tap', function(e) {
            var tag = e.target.tagName.toLowerCase();
            if (tag == 'img' && e.target.src.indexOf("twxq_") == -1) {
                WeiQuPai.app.statReport({
                    act: 'discount_pic_tap'
                });
                var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.SimpleViewer');
                var spic = WeiQuPai.Util.getImagePath(e.target.src);
                var bpic = spic;
                viewer.setPic(spic, bpic);
                viewer.show();
            }
            return false;
        }, this);
        this.element.dom.addEventListener('click', function(e) {
            var tag = e.target.tagName.toLowerCase();
            if (tag == 'a') {
                e.preventDefault();
                var title = e.target.title || '微趣拍';
                window.open(e.target.href, '_blank', 'location=no,title=' + title);
            }
        }, false);
    },

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