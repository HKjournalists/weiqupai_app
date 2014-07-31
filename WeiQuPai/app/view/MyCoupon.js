Ext.define('WeiQuPai.view.MyCoupon', {
    extend: 'Ext.Container',
    xtype: 'mycoupon',
    config: {
        cls: 'paijuan',
        items: [{
            xtype: 'vtitlebar',
            title: '我的拍券',
            docked: 'top',
            cls: 'w-title',
            items: [{
                iconCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'container',
            itemId: 'paiquan',
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="plist">',
                '<div class="m10">{coupon_info.name} X {num}</div>',
                '<div class="right" >过期时间：{coupon_info.expire_time} <tpl if="coupon_info.expired">[已过期]</tpl></div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</tpl>'
            )
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
            xtype: 'container',
            items: [{
                xtype: 'button',
                text: '积分兑换拍券',
                baseCls: 'orderdetail_btn_e7'
            }]
        }]
    },

    initialize: function() {
        this.loadData();
        this.callParent(arguments);
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;

        WeiQuPai.Notify.clearNotify(WeiQuPai.Notify.MSG_NEW_COUPON);

        this.msgbox = WeiQuPai.Util.msgbox('您还没有任何拍券');
        this.add(this.msgbox);

    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.host + '/?r=appv2/myCoupon&token=' + user.token;
        var me = this;
        WeiQuPai.Util.get(url, function(data) {
            me.down('#paiquan').setData(data);

        });
    }
});