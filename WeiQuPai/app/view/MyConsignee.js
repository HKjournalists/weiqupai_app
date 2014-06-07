Ext.define('WeiQuPai.view.MyConsignee', {
    extend: 'WeiQuPai.view.SwipeButtonList',
    xtype: 'myconsignee',
    requires: ['WeiQuPai.view.AddConsigneeForm', 'WeiQuPai.view.EditConsigneeForm'],
    config:{
        store: 'UserConsignee',
        title: '收货信息',
        selectMode: false,
        itemTpl: new Ext.XTemplate(
            '<div class="w-list-item">',
                '<div class="content">',
                    '<p>收货人：{name:htmlEncode}</p>',
                    '<p>电话：{mobile:htmlEncode}</p>',
                    '<p>地址：{province}{city}{address:htmlEncode}</p>',
                    '<p>邮编：{zip}</p>',
                '</div>',
                '<tpl if="is_default==1">',
                    '<div class="is-default">默认</div>',
                '</tpl>',
            '</div>',
            '<div class="button-area">',
                '<tpl if="is_default==0">',
                '<div class="swipe-button-default">设为默认</div>',
                '</tpl>',
                '<div class="swipe-button-delete">删除</div>',
            '</div>'
        ),
       
        items: [
            {
                xtype: 'titlebar',
                title: '收货地址',
                docked: 'top',
                cls: 'w-title'
            },
            {
                xtype: 'bottombar'
            }
        ]
    },

    initialize: function(){
        this.callParent(arguments);
        var btn = {xtype: 'button', iconCls:'icon-address', cls: 'w-toolbar-button', text: '添加收货信息', action: 'showAdd'};
        this.down('bottombar #buttonContainer').add(btn);

        user = WeiQuPai.Util.checkLogin();
        if(!user) return;

        this.msgbox = WeiQuPai.Util.msgbox('您还没有添加收货信息.');
        this.add(this.msgbox);

        this.getStore().getProxy().setExtraParam('token', user.token);
        this.getStore().load(function(records, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
                return;
            }
            if(records.length == 0){
                this.msgbox.show(); 
                return;
            }
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
                store.removeAll();
                return false;
            }
        }, this);

        //是否是订单选择模式
        if(!this.getSelectMode()){
            this.on('itemtap', this.showEditForm, this);
        }
    },



    //显示编辑表单
    showEditForm: function(list, index, dataItem, record){
        var view = Ext.create('WeiQuPai.view.EditConsigneeForm');
        record.data.uc_id = record.data.id;
        view.setValues(record.data);
        view.setButtonState();
        Ext.Viewport.down('main').push(view);
    },
});
