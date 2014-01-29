Ext.define('WeiQuPai.view.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'register',
    requires: ['Ext.field.Text', 'Ext.field.Password'],
    config: {
        
        items: [
            {
                xtype: 'titlebar',
                title: '注册',
                docked: 'top'
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
                name: 'password',
                xtype: 'passwordfield',
                cls: 'w-input-text w-margin',
                inputCls: 'w-icon-password',
                placeHolder: '重复输入密码'
            },
            {
                xtype: 'button',
                text: '注册',
                cls: 'w-button w-margin',
                action: 'register'
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                cls: 'w-toolbar',
                items: [
                    {
                        xtype: 'button',
                        cls: 'x-button-back',
                        action: 'back'
                    }
                ]
            }
        ]        
    }
});