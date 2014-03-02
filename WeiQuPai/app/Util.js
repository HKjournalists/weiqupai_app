Ext.define("WeiQuPai.Util", {
    singleton: true,
    requires: ['WeiQuPai.view.InputComment', 'WeiQuPai.view.CameraLayer'],
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

        cmp = Ext.create(com, Ext.merge(config, conf));
        Ext.Viewport.add(cmp);
        return cmp;
    }, 

    //显示评论表单
    showCommentForm: function(){
        if(!this.commentForm){
            var config = {height: 200};
            this.commentForm = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', config);
        }
        this.commentForm.show(); 
        return this.commentForm;
    },

    /**
     * 显示相机菜单
     * 
     * @param int picWidth 要获取的图片宽度
     * @Param int picHeight 要获取的图片高度
     */
    showCameraLayer: function(picWidth,picHeight, callback){
        if(!this.cameraLayer){
            var config = {height: 200, picWidth: picWidth, picHeight: picHeight, callback: callback};
            this.cameraLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.CameraLayer', config);
        }
        this.cameraLayer.show();
        return this.cameraLayer;
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

    //更新用户设置
    updateSetting: function(field, value){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user) return;
        if(user[field] == value) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userSetting&token=' + user.token,
            params:{f: field, flag: value},
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                //更新本地的用户设置缓存
                user[field] = value; 
                WeiQuPai.Cache.set('currentUser', user);
            }
        });
    },

    updateProfile: function(data, callback){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user) return;
        //检查属性是否有变化
        var changed = false;
        for(f in data){
            if(user[f] != data[f]){
                changed = true;
                break;
            }
        }
        if(!changed) return;

        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/profile/update&token=' + user.token,
            params: data,
            method: 'post',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                //更新本地的用户设置缓存
                user = Ext.merge(user, data);
                WeiQuPai.Cache.set('currentUser', user);
                callback && callback();
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '数据提交失败，请检查网络');
            }
        });
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

    //生成一个展现提示信息的容器
    msgbox: function(html, cfg){
        var config = {
            cls: 'w-content',
            html: html,
            itemId: 'msgbox'
        };
        config = Ext.merge(config, cfg);
        return Ext.create('Ext.Container', config);
    },

    showTab: function(tab){
        var main = Ext.Viewport.down('main');
        mainTab = main.down('maintab');
        mainTab.setActiveItem(tab);
        main.pop(mainTab);
    }

})