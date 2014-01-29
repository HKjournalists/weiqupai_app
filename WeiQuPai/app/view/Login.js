Ext.define('WeiQuPai.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.form.FieldSet', 'WeiQuPai.view.Register'],
    config: {
        items: [
            {
                xtype: 'titlebar',
                title: '登录',
                docked: 'top'
            },
            {
                xtype: 'container',
                cls: 'w-logo'

            },
            {
                name: 'uname',
                xtype: 'textfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-user',
                placeHolder: '填写用户名/手机'

            },
            {
                name: 'password',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-password',
                placeHolder: '填写密码'
            },
            {
                xtype: 'button',
                text: '登录',
                cls: 'w-button w-margin',
                action: 'login'             
            },
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
            {
                xtype: 'container',
                cls: 'w-container',
                layout: {
                    type: 'hbox',
                },
                items: [
                    {
                        xtype: 'button',
                        text: '没有帐号？注册',
                        cls: 'w-button',
                        action: 'goregister',
                        flex: 2
                    },
                    {
                        xtype: 'spacer',
                        width: '1em'
                    },
                    {
                        xtype: 'button',
                        text: '逛逛',
                        cls: 'w-button',
                        action: 'gomain',
                        flex: 1
                    }
                ]
            }
        ]        
    }
});