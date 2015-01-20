Ext.define('WeiQuPai.controller.VerifyPhone', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'verifyphone',
            smsButton: 'verifyphone button[action=sendsms]'
        },
        control: {
            pageView: {
                verify: 'doVerify'
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

    doVerify: function(btn) {
        var form = WeiQuPai.navigator.down('verifyphone');
        var data = form.getValues();
        data.token = this.smsToken;
        var url = WeiQuPai.Util.apiUrl('r=appv2/verify/');
        var page = this.getPageView();
        WeiQuPai.Util.post(url, data, function() {
            var callback = page.getVerifySuccess();
            Ext.isFunction(callback) && callback.apply(page);
        });
    },

    //发送短信
    doSendSms: function(btn){
        var phone = this.getPageView().down('textfield[name=phone]').getValue();
        if(!/^1[34578][0-9]{9}$/.test(phone)){
            WeiQuPai.Util.toast('请输入正确的手机号码');
            return;
        }
        btn.setDisabled(true);
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Util.apiUrl('r=appv2/verify/send&phone=' + phone);
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
    }
});