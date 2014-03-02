
Ext.define('WeiQuPai.view.FieldForm', {
    extend: 'Ext.form.Panel',
    xtype: 'fieldform',
    config: {
        title: null,
        field: null,
        value: null,
        items: [
            {
                xtype: 'fieldset',
                cls: 'w-fieldset',
                items: [
                    {
                        name: 'name',
                        xtype: 'textfield',
                        cls: 'w-input-fullwidth',
                        placeHolder: '',
                        autoComplete: false
                    }
                ]
            },
            {
                xtype: 'button',
                cls: 'w-button w-margin',
                text: '保存',
                action: 'save',
                disabled: true
            },
            {
                xtype: 'bottombar'
            }
        ]
    },

    applyField: function(field){
        this.down('textfield').setName(field);
        return field;
    },

    applyTitle: function(title){
        this.down('textfield').setPlaceHolder(title);
        return title;
    },

    applyValue: function(value){
        this.down('textfield').setValue(value);
        return value;
    },

    initialize: function(){
        this.setButtonState();
        this.down('textfield').on('keyup', this.setButtonState, this);
        this.down('button[action=save]').on('tap', this.saveProfile, this);
    },

    setButtonState: function(){
        var disabled = !this.down('textfield').getValue();
        this.down('button[action=save]').setDisabled(disabled);
    },

    saveProfile: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        var field = this.getField();
        var value = this.down('textfield').getValue();
        //没修改直接返回
        if(user[field] == value){
            Ext.Viewport.down('main').pop();
            return;
        }
        WeiQuPai.Util.mask();
        this.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/profile/update&token=' + user.token,
            method: 'post',
            success: function(form, result){
                WeiQuPai.Util.unmask();
                if(result && result.success){
                    form.reset();
                    var preview = Ext.Viewport.down('main').pop();
                    preview.down('#' + field).setContent(value);
                    //保存到本地缓存
                    user[field] = value;
                    WeiQuPai.Cache.set('currentUser', user);
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
