Ext.define('WeiQuPai.view.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'register',
    requires: ['Ext.field.Text', 'Ext.field.Password'],
    config: {
        scrollable: 'vertical',
        items: [
            {
                xtype: 'titlebar',
                title: '注册',
                docked: 'top',
                cls: 'w-title'
            },
            {
                name: 'uname',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                placeHolder: '手机/邮箱',
                autoComplete: false

            },
            {
                name: 'password',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                placeHolder: '填写密码',
                autoComplete: false
            },
            {
                name: 'password2',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                placeHolder: '重复输入密码',
                autoComplete: false
            },
            {
                name: 'nick',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                placeHolder: '昵称',
                autoComplete: false

            },
            {
                name: 'invite',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                placeHolder: '邀请人用户名',
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
        this.down('textfield[name=nick]').on('keyup', this.setButtonState, this);
        this.down('passwordfield[name=password]').on('keyup', this.setButtonState, this);
        this.down('passwordfield[name=password2]').on('keyup', this.setButtonState, this);
    },

    setButtonState: function(){
        var disabled = this.down('textfield[name=uname]').getValue().length == 0
        || this.down('textfield[name=nick]').getValue().length == 0
        || this.down('passwordfield[name=password]').getValue().length == 0
        || this.down('passwordfield[name=password2]').getValue().length == 0;
        this.down('button[action=register]').setDisabled(disabled);
    }
});