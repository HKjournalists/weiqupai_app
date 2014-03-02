Ext.define('WeiQuPai.view.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'register',
    requires: ['Ext.field.Text', 'Ext.field.Password'],
    config: {
        
        items: [
            {
                name: 'uname',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-user',
                placeHolder: '填写用户名',
                autoComplete: false

            },
            {
                name: 'password',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-password',
                placeHolder: '填写密码',
                autoComplete: false
            },
            {
                name: 'password2',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-password',
                placeHolder: '重复输入密码',
                autoComplete: false
            },
            {
                xtype: 'button',
                text: '注册',
                cls: 'w-button w-margin',
                action: 'register',
                disabled: true
            },
            {
                xtype: 'bottombar'
            }
        ]        
    },

    initialize: function(){
        this.down('textfield[name=uname]').on('keyup', this.setButtonState, this);
        this.down('passwordfield[name=password]').on('keyup', this.setButtonState, this);
        this.down('passwordfield[name=password2]').on('keyup', this.setButtonState, this);
    },

    setButtonState: function(){
        var disabled = this.down('textfield[name=uname]').getValue().length == 0
        || this.down('passwordfield[name=password]').getValue().length == 0
        || this.down('passwordfield[name=password2]').getValue().length == 0;
        this.down('button[action=register]').setDisabled(disabled);
    }
});