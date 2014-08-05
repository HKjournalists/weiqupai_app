Ext.define('WeiQuPai.controller.MyConsignee', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            myConsignee: 'myconsignee',
            addBtn: 'disclosureitem[itemId=addConsignee]',
            editBtn: 'consigneepoplayer button[action=edit]',
            selectBtn: 'consigneepoplayer button[action=select]',
            setDefaultBtn: 'consigneepoplayer button[action=setDefault]',
            delBtn: 'consigneepoplayer button[action=del]',
            addForm: 'addconsigneeform',
            editForm: 'editconsigneeform',
            doAddBtn: 'addconsigneeform button[action=add]',
            doUpdateBtn: 'editconsigneeform button[action=update]'

        },
        control: {
            selectBtn: {
                tap: 'doSelect'
            },
            setDefaultBtn: {
                tap: 'doItemSetDefault'
            },
            delBtn: {
                tap: 'doItemDelete'
            },
            addBtn: {
                'tap': 'showAddForm'
            },
            editBtn: {
                tap: 'showEditForm'
            },
            doAddBtn: {
                'tap': 'doAddConsignee'
            },
            doUpdateBtn: {
                'tap': 'doEditConsignee'
            }
        }
    },

    doSelect: function() {
        var pageView = this.getMyConsignee();
        var record = pageView.down('dataview').getSelection()[0];
        pageView.popLayer.hide();
        pageView.fireEvent('selected', record);
    },

    doItemDelete: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var pageView = this.getMyConsignee();
        var dataView = pageView.down('dataview');
        var record = dataView.getSelection()[0];
        var id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee/del&id=' + id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function() {
            pageView.popLayer.hide();
            dataView.getStore().remove(record);
            if (dataView.getStore().getCount() == 0) {
                pageView.msgbox.show();
            }
        }, {
            mask: true
        });
    },

    doItemSetDefault: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var pageView = this.getMyConsignee();
        var dataView = pageView.down('dataview');
        var record = dataView.getSelection()[0];
        var id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee/default&id=' + id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function() {
            pageView.popLayer.hide();
            var oldRecord = dataView.getStore().findRecord('is_default', 1, 0, null, null, true);
            if (oldRecord) oldRecord.set('is_default', 0);
            record.set('is_default', 1);
        }, {
            mask: true
        });
    },

    showAddForm: function() {
        var view = Ext.create('WeiQuPai.view.AddConsigneeForm');
        WeiQuPai.navigator.push(view);
    },

    //显示编辑表单
    showEditForm: function(list, index, dataItem, record) {
        var pageView = this.getMyConsignee();
        pageView.popLayer.hide();
        var dataView = pageView.down('dataview');
        var record = dataView.getSelection()[0];
        var view = Ext.create('WeiQuPai.view.EditConsigneeForm');
        record.data.uc_id = record.data.id;
        view.setValues(record.data);
        view.setButtonState();
        WeiQuPai.navigator.push(view);
    },

    doAddConsignee: function(btn) {
        var form = this.getAddForm();
        var user = WeiQuPai.Cache.get('currentUser');
        var pageView = this.getMyConsignee();
        var dataView = this.getMyConsignee().down('dataview');
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee/create&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) return false;

                if (result && result.success) {
                    var data = form.getValues();
                    form.reset();
                    pageView.msgbox.hide();
                    data.id = result.id;
                    data.is_default = result.is_default;
                    dataView.getStore().addData(data);
                    WeiQuPai.navigator.pop();
                }
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },

    doEditConsignee: function(btn) {
        var form = this.getEditForm();
        var user = WeiQuPai.Cache.get('currentUser');
        var pageView = this.getMyConsignee();
        var dataView = this.getMyConsignee().down('dataview');
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee/update&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) return false;

                if (result && result.success) {
                    var data = form.getValues();
                    data.id = data.uc_id;
                    form.reset();
                    pageView.msgbox.hide();
                    var record = dataView.getStore().getById(data.id);
                    record.set(data);
                    WeiQuPai.navigator.pop();
                }
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    }
});