Ext.define('WeiQuPai.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            loginForm: 'login',
            login: 'button[action=login]',
            register: 'button[action=goregister]',
            forgetpass: 'button[action=forgetpass]',
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
            },
            forgetpass:{
                tap: 'showForgetPass'
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
        WeiQuPai.Util.toast('qq登录');
    },

    doWeiboLogin: function(){
        WeiQuPai.Util.toast('微博登录');
    },
    
    doLogout: function(){
        WeiQuPai.Util.logout();
        WeiQuPai.Util.showTab('today'); 
    },

    showForgetPass: function(){
        var view = Ext.create('WeiQuPai.view.WebPage');
        var user = WeiQuPai.Cache.get('currentUser');
        var href = 'http://www.vqupai.com/mm/index.php?r=password/reset';
        if(user) href += (href.indexOf("?") == -1 ? '?' : '&')  + 'token=' + user.token;
        view.setHref(href);
        //view.setReloadOnBack(true);
        view.setTitle('找回密码');
        Ext.Viewport.down('main').push(view);
    }
});
