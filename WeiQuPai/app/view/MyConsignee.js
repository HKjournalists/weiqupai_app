Ext.define('WeiQuPai.view.MyConsignee', {
    extend: 'Ext.Container',
    xtype: 'myconsignee',
    requires: ['WeiQuPai.view.ConsigneePopLayer', 'WeiQuPai.view.AddConsigneeForm', 'WeiQuPai.view.EditConsigneeForm'],
    config: {
        selectMode: false,
        cls: 'bg_ef',
        scrollable: 'vertical',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true,
            refreshFn: 'fetchLastest',
        }],
        items: [{
            xtype: 'vtitlebar',
            title: '收货信息',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'dataview',
            store: 'MyConsignee',
            scrollable: null,
            loadingText: null,
            itemCls: 'consignee-list-item',
            itemTpl: new Ext.XTemplate(
                '<div class="{[this.getDefaultCls(values.is_default)]}"">',
                '<h3>{name:htmlEncode} {mobile:htmlEncode}</h3>',
                '<p>{province}{city}{address:htmlEncode} {zip}</p>',
                '</div>', {
                    getDefaultCls: function(is_default) {
                        return is_default == 1 ? 'selected' : '';
                    }
                }
            )

        }, {
            xtype: 'disclosureitem',
            itemId: 'addConsignee',
            title: '新增地址'
        }]
    },

    msgbox: null,
    popLayer: null,

    initialize: function() {
        this.callParent(arguments);

        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        this.popLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ConsigneePopLayer');
        this.popLayer.down('button[action=select]').setHidden(!this.getSelectMode());
        this.down('dataview').on('itemtap', this.onItemTap, this);
        this.loadData();
    },

    onItemTap: function(list, index, dataItem, record, e) {
        this.popLayer.down('button[action=setDefault]').setDisabled(record.get('is_default') == 1);
        this.popLayer.show();
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var store = this.down('dataview').getStore();
        this.down('dataview').setLoadingText(null);
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success) {
            Ext.isFunction(callback) && callback();
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return;
            }
            if (records.length == 0) {
                this.msgbox.show();
                return;
            }
            if (!WeiQuPai.Util.invalidToken(records[0].raw)) {
                store.removeAll();
                return false;
            }
        }, this);

    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
        });
    }
});