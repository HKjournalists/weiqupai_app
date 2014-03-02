Ext.define('WeiQuPai.controller.MyConsignee', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myconsignee: 'myconsignee',
            showAdd: 'myconsignee button[action=showAdd]',
            addForm: 'addconsigneeform',
            doAdd: 'addconsigneeform button[action=add]'

    	},
        control: {
        	myconsignee: {
                'itemdelete': 'doItemDelete',
                'itemdefault': 'doItemSetDefault',
                'select': 'doItemSelect'
            },
            showAdd: {
                'tap': 'showAddForm'
            },
            doAdd: {
                'tap': 'doAddConsignee'
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
                list.getStore().remove(record);
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.msg.Alert(null, '删除失败, 请重试');
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
                var oldRecord = list.getStore().findRecord('is_default', 1, 0, null, null, true);
                if(oldRecord) oldRecord.set('is_default', 0);
                record.set('is_default', 1);
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.msg.Alert(null, '数据提交失败，请重试');
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
                if(result && result.success){
                    var data = form.getValues();
                    form.reset();
                    var preview = self.getMain().pop();
                    data.id = result.id;
                    data.is_default = result.is_default;
                    preview.getStore().addData(data);
                }
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                Ext.Msg.alert(null, msg);
            }
        });
    }
});
