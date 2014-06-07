Ext.define('WeiQuPai.controller.MyConsignee', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myconsignee: 'myconsignee',
            showAdd: 'myconsignee button[action=showAdd]',
            addForm: 'addconsigneeform',
            editForm: 'editconsigneeform',
            doAdd: 'addconsigneeform button[action=add]',
            doUpdate: 'editconsigneeform button[action=update]'

    	},
        control: {
        	myconsignee: {
                'itemdelete': 'doItemDelete',
                'itemdefault': 'doItemSetDefault'
            },
            showAdd: {
                'tap': 'showAddForm'
            },
            doAdd: {
                'tap': 'doAddConsignee'
            },
            doUpdate: {
                'tap': 'doEditConsignee'
            }
        }
    },

    doItemDelete: function(list, index, dataItem, record, e){
        var user = WeiQuPai.Cache.get('currentUser');
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userConsignee/del&token=' + user.token,
            params: {id: record.get('id')},
            method: 'get',
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;

                list.getStore().remove(record);
                if(list.getStore().getCount() == 0){
                    list.msgbox.show();
                }
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('删除失败, 请重试');
            }
        });
    },

    doItemSetDefault: function(list, index, dataItem, record, e){
        var user = WeiQuPai.Cache.get('currentUser');
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userConsignee/default&token=' + user.token,
            params: {id: record.get('id')},
            method: 'get',
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;

                var oldRecord = list.getStore().findRecord('is_default', 1, 0, null, null, true);
                if(oldRecord) oldRecord.set('is_default', 0);
                record.set('is_default', 1);
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('数据提交失败，请重试');
            }
        });
    },

    showAddForm: function(btn){
        var view = Ext.create('WeiQuPai.view.AddConsigneeForm');
        this.getMain().push(view);
    },

    doAddConsignee: function(btn){
        var form = this.getAddForm();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userConsignee/create&token=' + user.token,
            method: 'post',
            success: function(form, result){
                WeiQuPai.Util.unmask();
                if(!WeiQuPai.Util.invalidToken(result)) return false;

                if(result && result.success){
                    var data = form.getValues();
                    form.reset();
                    var preview = self.getMain().pop();
                    preview.msgbox.hide();
                    data.id = result.id;
                    data.is_default = result.is_default;
                    preview.getStore().addData(data);
                }
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },

     doEditConsignee: function(btn){
        var form = this.getEditForm();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userConsignee/update&token=' + user.token,
            method: 'post',
            success: function(form, result){
                WeiQuPai.Util.unmask();
                if(!WeiQuPai.Util.invalidToken(result)) return false;

                if(result && result.success){
                    var data = form.getValues();
                    data.id = data.uc_id;
                    form.reset();
                    var preview = self.getMain().pop();
                    preview.msgbox.hide();
                    var record = preview.getStore().getById(data.uc_id);
                    record.set(data);
                }
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    }
});
