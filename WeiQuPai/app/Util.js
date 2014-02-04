Ext.define("WeiQuPai.Util", {
    singleton: true,
    requires: ['WeiQuPai.view.InputComment'],
    createOverlay : function(com, conf){
    	var config = {
            bottom: 0,
            left:0,
            hidden: true,
            height: '50%',
            width: '100%',
            showAnimation:{
                type: 'slideIn',
                direction: 'up'
            },
            hideAnimation:{
                type: 'slideOut',
                direction: 'down'
            },
            modal: true,
            hideOnMaskTap: true
    	};

        var cmp = Ext.create(com, Ext.merge(config, conf));
        Ext.Viewport.add(cmp);
        return cmp;
    }, 

    showCommentForm: function(){
        var config = {
            centered: true,
            height: 200
        };
        var comment = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', config);
        comment.show();
    },

    isLogin: function(){
        return WeiQuPai.Cache.get('currentUser') != null;
    },

    login: function(uname, password, callback){
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: '正在登录...'
        });
        Ext.Ajax.request({
            url: 'login.json',
            method: 'post',
            params: {
                uname: uname,
                password: password
            },
            success: function(rsp){
                setTimeout(function(){
                Ext.Viewport.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code != 0){
                    Ext.Msg.alert(null, '用户名或密码错误');
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                callback && callback();
                }, 1000);
            },
            failure: function(rsp){
                Ext.Viewport.unmask();
                Ext.msg.Alert(null, '网络不给力');
            }
        });
    },

    register: function(uname, password, callback){
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: '正在提交...'
        });
        Ext.Ajax.request({
            url: 'reg.json',
            method: 'post',
            params: {
                uname: uname,
                password: password
            },
            success: function(rsp){
                setTimeout(function(){
                Ext.Viewport.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code != 0){
                    Ext.Msg.alert(null, '注册失败, 请重试');
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                callback && callback();
                }, 1000);
            },
            failure: function(rsp){
                Ext.Viewport.unmask();
                Ext.msg.Alert(null, '网络不给力');
            }
        });
    },

    logout: function(callback){
        WeiQuPai.Cache.remove('currentUser');
        callback && callback();
    },


    showTab: function(tab){
        var main = Ext.Viewport.down('main');
        mainTab = main.down('maintab');
        mainTab.setActiveItem(tab);
        main.pop(mainTab);
    }

})