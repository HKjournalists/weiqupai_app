Ext.define('WeiQuPai.view.VerifyPhone', {
    extend: 'Ext.form.Panel',
    xtype: 'verifyphone',
    config: {
        scrollable: 'vertical',
        cls: 'verifyphone',
        items: [{
            xtype: 'vtitlebar',
            title: '手机验证',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            html: '<div class="validate">' +
                '<span>手机短信验证：</span><br><br>' +
                '<ul>' +
                '<li>请输入您的手机号，点击“获取验证码”获取验证短信</li>' +
                '<li>将收到的短信验证码输入后提交即可完成验证</li>' +
                '<li>如没有成功获取验证码，请在60秒后尝试再次获取</li>' +
                '</ul>' +
                '</div>'
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                flex: 1,
                xtype: 'textfield',
                component:{
                    type: 'tel'
                },
                placeHolder: '输入手机号',
                baseCls: 'validate_text',
                name: 'phone'
            }, {
                xtype: 'button',
                width: '100px',
                baseCls: 'validate_btn',
                text: '获取验证码',
                action: 'sendsms',
                style: 'margin-right:10px'
            }]
        }, {
            xtype: 'textfield',
            component:{
                type: 'tel'
            },
            placeHolder: '请输入短信验证码',
            baseCls: 'validate_text',
            name: 'vcode'
        }, {
            xtype: 'button',
            baseCls: 'w-button validate_sbt',
            text: '提交',
            disabled: true,
            action: 'verifyPhone'
        }],

        verifySuccess: null
    },

    initialize: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        user && this.down('textfield[name=phone]').setValue(user.phone);
        this.down('textfield[name=phone]').on('keyup', this.setButtonState, this);
        this.down('textfield[name=vcode]').on('keyup', this.setButtonState, this);

        this.down('button[action=verifyPhone]').on('tap', function() {
            this.fireEvent('verify', this);
        }, this);
        
        var me = this;
        this.element.dom.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!me.down('button[action=verifyPhone]').getDisabled()) {
                me.fireEvent('verify', me);
            }
        }, this); 
    },

    setButtonState: function() {
        var disabled = this.down('textfield[name=phone]').getValue().length == 0
        || this.down('textfield[name=vcode]').getValue().length == 0;
        this.down('button[action=verifyPhone]').setDisabled(disabled);
    }
});