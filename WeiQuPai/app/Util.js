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
        if(!this.commentForm){
            this.commentForm = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', config);
        }
        this.commentForm.show();
    },

    mask: function(msg){
        Ext.Viewport.setMasked({xtype: 'loadmask', message: msg});
    },
    unmask: function(){
        Ext.Viewport.unmask();
    },

    isLogin: function(){
        return WeiQuPai.Cache.get('currentUser') != null;
    },

    login: function(uname, password, callback){
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/login',
            method: 'post',
            params: {
                uname: uname,
                password: password
            },
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code && rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                callback && callback();
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.Alert(null, '登录失败，请重试');
            }
        });
    },

    register: function(uname, password, callback){
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/join',
            method: 'post',
            params: {
                uname: uname,
                password: password
            },
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                callback && callback();
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.msg.Alert(null, '注册失败, 请重试');
            }
        });
    },

    logout: function(callback){
        var user = WeiQuPai.Cache.get('currentUser');
        if(user){
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=app/logout&token=' + user.token,
                method: 'get'
            });
            WeiQuPai.Cache.remove('currentUser');

        }
        callback && callback();
    },

    //过滤对象的空值
    filterNull: function(obj){
        var res = {};
        for(k in obj){
            if(obj.hasOwnProperty(k) && obj[k] != null){
                res[k] = obj[k];
            }
        }
        return res;
    },

    showTab: function(tab){
        var main = Ext.Viewport.down('main');
        mainTab = main.down('maintab');
        mainTab.setActiveItem(tab);
        main.pop(mainTab);
    }

})