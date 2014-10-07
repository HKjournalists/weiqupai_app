Ext.define('WeiQuPai.controller.Register', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            regForm: 'register',
            register: 'register button[action=register]'
        },
        control: {
            register: {
                tap: 'doRegister'
            }
        }
    },

    doRegister: function(btn) {
        if (!this.checkForm()) {
            return false;
        }
        var form = WeiQuPai.navigator.down('register');
        var data = form.getValues();
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

    checkForm: function() {
        var form = WeiQuPai.navigator.down('register');
        var d = form.getValues();
        var msg = null;
        if (d.uname.trim().length < 6) {
            msg = '用户名不能少于6个字符';
        } else if (d.password.trim().length < 6 /* || d.password2.trim().length < 6*/ ) {
            msg = '密码不能少于6位';
        }
        if (msg) {
            WeiQuPai.Util.toast(msg);
            return false;
        }
        return true;
    }
});