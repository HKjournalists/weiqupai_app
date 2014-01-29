Ext.define('WeiQuPai.view.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'register',
    
    config: {
        title: '注册',
        
        items: [
            {
                name: 'uname',
                xtype: 'textfield',
                label: '用户名'
            },
            {
                name: 'password',
                xtype: 'textfield',
                label: '密码'
            },
            {
                name: 'cfpasssword',
                xtype: 'textfield',
                label: '密码确认'
            },
            {
                xtype: 'button',
                text: '注册',
                ui: 'confirm'
            }
        ]        
    }
});