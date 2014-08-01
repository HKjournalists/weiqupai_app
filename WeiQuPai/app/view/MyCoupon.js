Ext.define('WeiQuPai.view.MyCoupon', {
    extend: 'Ext.Container',
    xtype: 'mycoupon',
    config: {
        selectMode: false,
        cls: 'paijuan',
        scrollable: 'vertical',

        items: [{
            xtype: 'vtitlebar',
            title: '我的拍券',
            docked: 'top'
        }, {
            xtype: 'dataview',
            store: 'MyCoupon',
            scrollable: null,
            loadingText: null,
            itemTpl: new Ext.XTemplate(
                '<div class="plist">',
                '<div class="m{coupon_info.value}">{coupon_info.name} X {num}</div>',
                '<div class="right" >过期时间：{coupon_info.expire_time} <tpl if="coupon_info.expired">[已过期]</tpl></div>',
                '<div style="clear:both"></div>',
                '</div>'
            ),
        }, {
            xtype: 'container',
            html: ['<div class="plist_shuo">',
                '<ul>',
                '<li style="margin:10px 0px;">',
                '<span >拍券使用规则：</span>',
                '</li>',
                '<li>',
                '拍券仅在购物时作为现金抵用',
                '</li>',
                '<li>',
                '一次购物只能使用一张',
                '</li>',
                '<li>',
                '拍券不找零',
                '</li>',
                '<li>',
                '要使用的拍券面额须高于商品当前价格',
                '</li>',
                '<li>',
                '拍券使用后,不可退回',
                '</li>',
                '</ul>',
                '</div>'
            ].join(""),

        }, {
            xtype: 'button',
            text: '积分兑换拍券',
            baseCls: 'w-button',
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        var btn = {
            xtype: 'button'
        };
        if (this.config.selectMode) {
            btn.baseCls = 'arrow_left',
            btn.action = 'back';
        } else {
            btn.baseCls = 'user';
            btn.action = 'ucenter';
        }
        this.down('vtitlebar').add(btn);

        this.loadData();
    },

    loadData: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var store = this.down('dataview').getStore();
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
    }
});