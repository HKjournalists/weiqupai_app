Ext.define('WeiQuPai.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    
    config: {
        title: '登录',
        
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
                xtype: 'button',
                text: '登录',
                ui: 'confirm'
            }
        ]        
    }
});