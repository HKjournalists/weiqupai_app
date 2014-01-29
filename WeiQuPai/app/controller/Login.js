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
            goMain: {
                tap: 'goMain'
            }
        }
    },
    
    doLogin: function(btn){
        Ext.Msg.alert(null, '登录');
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

    goMain: function(){
        var main = Ext.create('WeiQuPai.view.MainTab');
        this.getMain().push(main);
    }
        
});
