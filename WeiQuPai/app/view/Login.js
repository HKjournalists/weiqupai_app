Ext.define('WeiQuPai.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.form.FieldSet', 'WeiQuPai.view.Register'],
    config: {
        scrollable: 'vertical',
        baseCls: 'login_bg',

        items: [{
            xtype: 'vtitlebar',
            title: '用户登录',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'container',
            baseCls: 'log_logo'
        }, {
            name: 'uname',
            xtype: 'textfield',
            cls: 'log_input',
            inputCls: 'w-icon-user',
            placeHolder: '用户名/手机号',
            autoComplete: false

        }, {
            name: 'password',
            xtype: 'passwordfield',
            cls: 'log_input1',
            inputCls: 'w-icon-password',
            placeHolder: '填写密码',
            autoComplete: false
        }, {
            xtype: 'container',
            cls: 'login_error',
            html: '亲，密码输错了额',
            hidden: true
        }, {
            xtype: 'button',
            text: '登    录',
            baseCls: 'login_btn',
            action: 'login',
            disabled: true
        }, {
            xtype: 'container',
            layout: 'hbox',
            baseCls: 'log_reg',
            style: 'margin-top:20px;',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '注册账号',
                action: 'goregister',
            }, {
                flex: 1,
                xtype: 'button',
                text: '忘记密码',
                action: 'forgetpass'
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            style: 'margin-top:20px;height:40px;',
            cls: 'log_reg',
            items: [{
                    xtype: 'button',
                    text: 'QQ登录',
                    itemId: 'qqlogin',
                    baseCls: 'log_qq'
                }, {
                    xtype: 'button',
                    text: '微博登录',
                    itemId: 'weibologin',
                    baseCls: 'log_wb'
                }

            ]
        }]
    },
    initialize: function() {
        this.down('textfield').on('keyup', this.setButtonState, this);
        this.down('passwordfield').on('keyup', this.setButtonState, this);
    },

    setButtonState: function() {
        var disabled = this.down('textfield').getValue().length == 0 || this.down('passwordfield').getValue().length == 0
        this.down('button[action=login]').setDisabled(disabled);
    }
});