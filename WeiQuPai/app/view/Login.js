Ext.define('WeiQuPai.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.form.FieldSet', 'WeiQuPai.view.Register'],
    config: {
        scrollable: 'vertical',
        items: [
            {
                xtype: 'titlebar',
                title: '登录',
                docked: 'top',
                cls: 'w-title'
            },
            {
                name: 'uname',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-user',
                placeHolder: '手机/邮箱',
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
                xtype: 'button',
                text: '登录',
                cls: 'w-button w-margin',
                action: 'login',
                disabled: true             
            },
            /*
            {
                xtype: 'fieldset',
                cls: 'w-fieldset',
                items: [
                    {
                        xtype: 'disclosureitem',
                        title: '使用QQ帐号登录',
                        itemId: 'qqlogin'
                    },
                    {
                        xtype: 'disclosureitem',
                        title: '使用微博帐号登录',
                        itemId: 'weibologin'
                    }

                ]
            },
        */
            {
                xtype: 'container',
                cls: 'w-container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'button',
                        text: '没有帐号？注册',
                        cls: 'w-button',
                        action: 'goregister',
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'button',
                align: 'right',
                text: '忘记密码？',
                cls: 'w-button-text',
                action: 'forgetpass'
            },
            {
                xtype: 'bottombar'
            }
        ]        
    },
    initialize: function(){
        this.down('textfield').on('keyup', this.setButtonState, this);
        this.down('passwordfield').on('keyup', this.setButtonState, this);
    },

    setButtonState: function(){
        var disabled = this.down('textfield').getValue().length == 0 || this.down('passwordfield').getValue().length == 0 
        this.down('button[action=login]').setDisabled(disabled);
    }
});