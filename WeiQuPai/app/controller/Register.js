Ext.define('WeiQuPai.controller.Register', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            regForm: 'register',
            smsButton: 'register button[action=sendsms]'
        },
        control: {
            regForm: {
                register: 'doRegister'
            },
            smsButton: {
                tap: 'doSendSms'
            }
        }
    },

    //发送短信时用的token
    smsToken: null,
    //计时器初始值
    leftTime: 60,
    //计时器
    countTimer: null,

    doRegister: function(btn) {
        if (!this.checkForm()) {
            return false;
        }
        var form = WeiQuPai.navigator.down('register');
        var data = form.getValues();
        data.token = this.smsToken;
        WeiQuPai.Util.register(data, function() {
            if (WeiQuPai.loginReferer) {
                WeiQuPai.sidebar.activeTabItem(WeiQuPai.loginReferer);
                WeiQuPai.loginReferer = null;
            }
            var prev = WeiQuPai.navigator.getPreviousItem();
            //如果是login页面就pop2个view出去
            var n = prev.isXType('login') ? 2 : 1;
            WeiQuPai.navigator.pop(n);
        });
    },

    //发送短信
    doSendSms: function(btn){
        var phone = this.getRegForm().down('textfield[name=uname]').getValue();
        if(!/^1[34578][0-9]{9}$/.test(phone)){
            WeiQuPai.Util.toast('请输入正确的手机号码');
            return;
        }
        btn.setDisabled(true);
        var url = WeiQuPai.Util.apiUrl('r=appv2/verify/send&phone=' + phone);
        if(this.smsToken){
            url += '&token=' + this.smsToken;
        }
        var self = this;
        WeiQuPai.Util.get(url, function(rsp){
            self.smsToken = rsp.token;
        });
        //设置倒计时
        this.leftTime = 60;
        this.countdown(btn);
        this.countTimer = setInterval(this.countdown.bind(this, btn), 1000);
    },

    countdown: function(btn){
        //如果已经切换了视图停止timer
        if(!Ext.Viewport.down('button[action=sendsms]')){
            clearInterval(this.countTimer);
        }
        if(this.leftTime <= 0){
           btn.setText('获取验证码');
           btn.setDisabled(false);
           clearInterval(this.countTimer);
           this.countTimer = null;
           return; 
        }
        btn.setText('重新发送(' + this.leftTime + ')');
        this.leftTime--;
    },


    checkForm: function() {
        var form = WeiQuPai.navigator.down('register');
        var d = form.getValues();
        var msg = null;
        if (d.password.trim().length < 6) {
            msg = '密码不能少于6位';
        }
        if (msg) {
            WeiQuPai.Util.toast(msg);
            return false;
        }
        return true;
    }
});