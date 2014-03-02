Ext.define('WeiQuPai.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            loginForm: 'login',
            login: 'button[action=login]',
            register: 'button[action=goregister]',
            goMain: 'button[action=gomain]',
            qqlogin: 'disclosureitem[itemId=qqlogin]',
            weibologin: 'disclosureitem[itemId=weibologin]',
            logout: 'button[action=logout]',
            main: 'main'
        },
        control: {
            login:{
                tap: 'doLogin'
            },
            register:{
                tap: 'showRegister'
            },
            qqlogin: {
                tap: 'doQQLogin'
            },
            weibologin: {
                tap: 'doWeiboLogin'
            },
            logout: {
                tap: 'doLogout'
            }
        }
    },
    
    doLogin: function(btn){
        var form = this.getLoginForm();
        var data = form.getValues();
        WeiQuPai.Util.login(data.uname, data.password, function(success){
            var main = Ext.Viewport.down('main');
            main.pop();
        });
    },

    showRegister: function(){
        var regView = Ext.create('WeiQuPai.view.Register');
        this.getMain().push(regView);
    },

    doQQLogin: function(){
        Ext.Msg.alert(null, 'qq登录');
    },

    doWeiboLogin: function(){
        Ext.Msg.alert(null, '微博登录');
    },
    
    doLogout: function(){
        WeiQuPai.Util.logout();
        WeiQuPai.Util.showTab('today'); 
    }
});
