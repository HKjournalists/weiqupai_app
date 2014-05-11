Ext.define("WeiQuPai.Util", {
    singleton: true,
    requires: ['WeiQuPai.view.InputComment', 'WeiQuPai.view.CirclePost', 'WeiQuPai.view.CircleReply', 'WeiQuPai.view.CameraLayer'],
    globalView: {},
    createOverlay : function(com, conf){
        if(this.globalView[com]) return this.globalView[com];
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
        this.globalView[com] = cmp;
        return cmp;
    }, 

    /**
     * 显示相机菜单
     * 
     * @param int picWidth 要获取的图片宽度
     * @Param int picHeight 要获取的图片高度
     */
    showCameraLayer: function(picWidth,picHeight, callback){
        if(!this.cameraLayer){
            var config = {height: 200};
            this.cameraLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.CameraLayer', config);
        }
        this.cameraLayer.setPicWidth(picWidth);
        this.cameraLayer.setPicHeight(picHeight);
        this.cameraLayer.setCallback(callback);
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

    //检查用户是否登录，如果未登录，跳到登录页面
    checkLogin: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user){
            WeiQuPai.Util.jumpLogin();
            return false;
        }
        return user;
    },

    //跳到登录页
    jumpLogin: function(){
        Ext.Viewport.down('main').push(Ext.create('WeiQuPai.view.Login'));
    },

    //检查server端返回的是否是401[invalid token],如果是，提醒用户登录
    invalidToken: function(obj){
        if(obj && obj.code && obj.code == 401){
            Ext.Msg.alert(null, '由于您长时间未登录，您需要重新登录', function(){
                WeiQuPai.Util.forward('login');
            });
            return false;
        }
        return true;
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
                WeiQuPai.Cache.set('currentUser', rsp.user);
                WeiQuPai.Cache.set('friends', rsp.friends);
                WeiQuPai.Cache.set('auctions', rsp.auctions);

                //注册之后绑定推送
                WeiQuPai.Util.bindPush();

                //登录后拍圈要清空并刷新
                var circle = Ext.Viewport.down('circle');
                circle.setForceReload(true);

                callback && callback();
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '登录失败，请重试');
            }
        });
    },

    register: function(data, callback){
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/join',
            method: 'post',
            params: data,
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                //注册之后绑定推送
                WeiQuPai.Util.bindPush();
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
            //删除用户相关的cache
            WeiQuPai.Cache.remove('currentUser');
            WeiQuPai.Cache.remove('friends');
            WeiQuPai.Cache.remove('upId');
            WeiQuPai.Cache.remove('auctions');
            //退出登录后拍圈要清空并刷新
            var circle = Ext.Viewport.down('circle');
            circle.setForceReload(true);

        }
        callback && callback();
    },

    //是否是好友
    isFriend: function(uid){
        var friends = WeiQuPai.Cache.get('friends') || [];
        if(friends.length == 0) return false;
        return friends.indexOf(uid) != -1;
    },

    //更新用户设置
    updateSetting: function(field, value){
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        if(user[field] == value) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/userSetting&token=' + user.token,
            params:{f: field, flag: value},
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
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
        var user = WeiQuPai.Util.checkLogin();
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
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
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
            itemId: 'msgbox',
            scrollDock: 'top',
            hidden: true
        };
        config = Ext.merge(config, cfg);
        return Ext.create('Ext.Container', config);
    },

    showTab: function(tab){
        var main = Ext.Viewport.down('main');
        //防止重复触发activate事件
        main.forceFireActive = false;
        mainTab = main.down('maintab');
        mainTab.setActiveItem(tab);
        main.pop(mainTab);
        main.forceFireActive = true;
    },

    //保存up过的id,如果已经保存过，返回false, cache列表最多保存100个
    cacheUp: function(id){
        var upId = WeiQuPai.Cache.get('upId') || [];
        if(upId.indexOf(id) != -1) return false;
        upId.push(id);
        if(upId.length > 100){
            upId.shift();
        }
        WeiQuPai.Cache.set('upId', upId);
        return true;
    },

    //转到某个视图，并带参数
    forward: function(xtype, config){
        var view = Ext.merge({xtype: xtype}, config);
        var main = Ext.Viewport.down('main');
        main.push(view);
    },

    //是否已拍过该商品
    hasAuction: function(auctionId){
        var auctions = WeiQuPai.Cache.get('auctions');
        return auctions && auctions.indexOf(auctionId) != -1;
    },

    //绑定推送消息，并将deviceToken,userId等信息回传给server
    bindPush: function(){
        if(!window.BPush) return;
        var user = WeiQuPai.Cache.get('currentUser');
        BPush.bindChannel(function(data){
            //绑定成功，但用户未登录，不需要回传
            if(!user) return;
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=app/bindPush/&token=' + user.token,
                params: data,
                method: 'post',
                success: function(rsp){
                    rsp = Ext.decode(rsp.responseText);
                    if(rsp.code > 0){
                        return;
                    }
                    //更新本地对应的缓存数据
                    user = Ext.merge(user, data);
                    WeiQuPai.Cache.set('currentUser', user);
                }
            });
        });
    },

    //加载服务器端的闪屏
    loadSplash: function(callback){
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/splashScreen&ver=' + WeiQuPai.Config.version,
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                callback && callback(rsp);
            },
            failure: function(){
                callback && callback();
            }
        });
    },

    //保存上一个视图，解决安卓下backbutton弹层不消失的问题
    saveLastView: function(){
        if(Ext.os.is.android){
            WeiQuPai.lastView = this;
        }
    }
})