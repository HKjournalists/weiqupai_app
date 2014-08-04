Ext.define('WeiQuPai.view.MyConsignee', {
    extend: 'Ext.Container',
    xtype: 'myconsignee',
    requires: ['WeiQuPai.view.AddConsigneeForm', 'WeiQuPai.view.EditConsigneeForm'],
    config: {
        store: 'MyConsignee',
        selectMode: false,
        cls: 'bg_ef',
        itemTpl: new Ext.XTemplate(
            '<div class="w-list-item">',
            '<div class="content">',
            '<p>{name:htmlEncode} {mobile:htmlEncode}</p>',
            '<p>{province}{city}{address:htmlEncode} {zip}</p>',
            '</div>',
            '<tpl if="is_default==1">',
            '<div class="is-default">默认</div>',
            '</tpl>',
            '</div>',
        ),

        items: [{
            xtype: 'vtitlebar',
            title: '收货信息',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);

        var user = WeiQuPai.Cache.get('currentUser');

        this.msgbox = WeiQuPai.Util.msgbox('您还没有添加收货信息.');
        this.add(this.msgbox);

        this.getStore().getProxy().setExtraParam('token', user.token);
        this.getStore().load(function(records, operation, success) {
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

        //是否是订单选择模式
        if (!this.getSelectMode()) {
            this.on('itemtap', this.showEditForm, this);
        }
    },

    //显示编辑表单
    showEditForm: function(list, index, dataItem, record) {
        var view = Ext.create('WeiQuPai.view.EditConsigneeForm');
        record.data.uc_id = record.data.id;
        view.setValues(record.data);
        view.setButtonState();
        Ext.Viewport.down('main').push(view);
    },
});