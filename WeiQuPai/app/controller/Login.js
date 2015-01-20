Ext.define('WeiQuPai.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            loginForm: 'login',
            register: 'button[action=goregister]',
            forgetpass: 'button[action=forgetpass]',
            goMain: 'button[action=gomain]',
            qqlogin: 'button[itemId=qqlogin]',
            weibologin: 'button[itemId=weibologin]',
            wxlogin: 'button[itemId=wechatlogin]'
        },
        control: {
            loginForm: {
                login: 'doLogin'
            },
            register: {
                tap: 'showRegister'
            },
            qqlogin: {
                tap: 'doQQLogin'
            },
            weibologin: {
                tap: 'doWeiboLogin'
            },
            wxlogin: {
                tap: 'doWechatLogin'
            },
            logout: {
                tap: 'doLogout'
            },
            forgetpass: {
                tap: 'showForgetPass'
            }
        }
    },

    doLogin: function(btn) {
        var form = WeiQuPai.navigator.down('login');
        var data = form.getValues();
        WeiQuPai.Util.login(data.uname, data.password, function(success) {
            if (WeiQuPai.loginReferer) {
                WeiQuPai.sidebar.activeTabItem(WeiQuPai.loginReferer);
                WeiQuPai.loginReferer = null;
            }
            WeiQuPai.navigator.pop();
        });
    },

    showRegister: function() {
        var regView = Ext.create('WeiQuPai.view.Register');
        WeiQuPai.navigator.push(regView);
    },

    doQQLogin: function() {
        var url = WeiQuPai.Util.apiUrl('r=appv2/QQLogin/login');
        var win = window.open(url, '_blank', 'location=no,title=QQ登录,closebuttoncaption=关闭');
        var appView = window;
        win.addEventListener('loadstop', function(e) {
            if (e.url.indexOf('QQLogin&code=') > 0) {
                win.executeScript({
                    code: 'window.json',
                }, function(param) {
                    WeiQuPai.Util.onLoginSuccess(param[0], function() {
                        if (WeiQuPai.loginReferer) {
                            WeiQuPai.sidebar.activeTabItem(WeiQuPai.loginReferer);
                            WeiQuPai.loginReferer = null;
                        }
                        var main = WeiQuPai.navigator;
                        main.pop();
                        win.close();
                    });
                });
            }
        }, false);
    },

    doWeiboLogin: function() {
        var url = WeiQuPai.Util.apiUrl('r=appv2/WBLogin/login');
        var win = window.open(url, '_blank', 'location=no,title=新浪微博登录,closebuttoncaption=关闭');
        var appView = window;
        win.addEventListener('loadstop', function(e) {
            if (e.url.indexOf('WBLogin&code=') > 0) {
                win.executeScript({
                    code: 'window.json',
                }, function(param) {
                    WeiQuPai.Util.onLoginSuccess(param[0], function() {
                        if (WeiQuPai.loginReferer) {
                            WeiQuPai.sidebar.activeTabItem(WeiQuPai.loginReferer);
                            WeiQuPai.loginReferer = null;
                        }
                        var main = WeiQuPai.navigator;
                        main.pop();
                        win.close();
                    });
                });
            }
        }, false);
    },

    //微信登录
    doWechatLogin: function(){
        if(!window.Wechat) return;
        Wechat.login(function(data){
            //获取到code后通过服务器进行验证获取用户信息
            var url = WeiQuPai.Util.apiUrl('r=appv2/wechatLogin&code=' + data.code);
            WeiQuPai.Util.get(url, function(rsp){
                WeiQuPai.Util.onLoginSuccess(rsp, function() {
                    if (WeiQuPai.loginReferer) {
                        WeiQuPai.sidebar.activeTabItem(WeiQuPai.loginReferer);
                        WeiQuPai.loginReferer = null;
                    }
                    var main = WeiQuPai.navigator;
                    main.pop();
                });
            }, {
                mask: true
            });
        }, function(error){
            console.log(error); 
        });
    },

    showForgetPass: function() {
        var view = Ext.create('WeiQuPai.view.WebPage');
        var user = WeiQuPai.Cache.get('currentUser');
        var href = 'http://www.vqupai.com/mm/index.php?r=password/reset';
        if (user) href += (href.indexOf("?") == -1 ? '?' : '&') + 'token=' + user.token;
        view.setHref(href);
        //view.setReloadOnBack(true);
        view.setTitle('找回密码');
        WeiQuPai.navigator.push(view);
    }
});