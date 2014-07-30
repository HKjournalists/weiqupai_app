Ext.define("WeiQuPai.Util", {
    singleton: true,
    requires: ['WeiQuPai.view.InputComment', 'WeiQuPai.view.CirclePost', 'WeiQuPai.view.CircleReply', 'WeiQuPai.view.CameraLayer', 'WeiQuPai.plugin.Toast', 'WeiQuPai.view.SimpleViewer'],
    globalView: {},
    createOverlay: function(com, conf) {
        if (this.globalView[com]) return this.globalView[com];
        var config = {
            bottom: 0,
            left: 0,
            hidden: true,
            height: '50%',
            width: '100%',
            showAnimation: {
                type: 'slideIn',
                direction: 'up'
            },
            hideAnimation: {
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

    slideUp: function() {
        this.element.show();
        Ext.Anim.run(this.element, 'slide', {
            direction: 'up',
            out: false
        });
        this.getModal().setHidden(false);
    },

    slideDown: function() {
        Ext.Anim.run(this.element, 'slide', {
            direction: 'down',
            out: true,
            autoClear: false,
            after: function(el) {
                el.hide();
            }
        });
        this.getModal().setHidden(true);
    },


    //获取一个全局view,不存在则创建
    getGlobalView: function(com) {
        if (!this.globalView[com]) {
            var cmp = Ext.create(com);
            Ext.Viewport.add(cmp);
            this.globalView[com] = cmp;
        }
        return this.globalView[com];
    },

    /**
     * 显示相机菜单
     *
     * @param int picWidth 要获取的图片宽度
     * @Param int picHeight 要获取的图片高度
     */
    showCameraLayer: function(picWidth, picHeight, crop, callback) {
        if (!this.cameraLayer) {
            var config = {
                height: 200
            };
            this.cameraLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.CameraLayer', config);
        }
        this.cameraLayer.setPicWidth(picWidth);
        this.cameraLayer.setPicHeight(picHeight);
        this.cameraLayer.setCrop(crop);
        this.cameraLayer.setCallback(callback);
        this.cameraLayer.show();
        return this.cameraLayer;
    },

    mask: function(msg) {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: msg
        });
    },
    unmask: function() {
        Ext.Viewport.unmask();
    },

    isLogin: function() {
        return WeiQuPai.Cache.get('currentUser') != null;
    },

    //检查用户是否登录，如果未登录，跳到登录页面
    checkLogin: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user) {
            WeiQuPai.Util.jumpLogin();
            return false;
        }
        return user;
    },

    //跳到登录页
    jumpLogin: function() {
        Ext.Viewport.down('main').push(Ext.create('WeiQuPai.view.Login'));
    },

    //检查server端返回的是否是401[invalid token],如果是，提醒用户登录
    invalidToken: function(obj) {
        if (obj && obj.code && obj.code == 401) {
            Ext.Msg.alert(null, '由于您长时间未登录，您需要重新登录', function() {
                WeiQuPai.Util.forward('login');
            });
            return false;
        }
        return true;
    },

    login: function(uname, password, callback) {
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/login',
            method: 'post',
            params: {
                uname: uname,
                password: password
            },
            success: function(rsp) {
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if (rsp.code && rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                this.onLoginSuccess(rsp, callback);
            },
            failure: function(rsp) {
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('登录失败，请重试');
            },
            scope: this
        });
    },

    //登录成功后的逻辑
    onLoginSuccess: function(data, callback) {
        WeiQuPai.Cache.set('currentUser', data.user);
        WeiQuPai.Cache.set('user_data', data.data);

        //注册之后绑定推送
        WeiQuPai.Util.bindPush();

        //登录后拍圈要清空并刷新
        var circle = Ext.Viewport.down('circle');
        circle && circle.setForceReload(true);

        //更新sidebar的状态
        WeiQuPai.sidebar.updateUserInfo();

        callback && callback();
    },

    register: function(data, callback) {
        //注册的时候绑定市场
        data.market = WeiQuPai.Config.market;
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/join',
            method: 'post',
            params: data,
            success: function(rsp) {
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                WeiQuPai.Cache.set('currentUser', rsp);
                //注册之后绑定推送
                WeiQuPai.Util.bindPush();
                callback && callback();
            },
            failure: function(rsp) {
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('注册失败, 请重试');
            }
        });
    },

    logout: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (user) {
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=app/logout&token=' + user.token,
                method: 'get'
            });
            //删除用户相关的cache
            WeiQuPai.Cache.remove('currentUser');
            WeiQuPai.Cache.remove('user_data');
            //退出登录后拍圈要清空并刷新
            var circle = Ext.Viewport.down('circle');
            circle && circle.setForceReload(true);

        }
        callback && callback();
    },

    updateProfile: function(data, callback) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        //检查属性是否有变化
        var changed = false;
        for (f in data) {
            if (user[f] != data[f]) {
                changed = true;
                break;
            }
        }
        if (!changed) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=app/profile/update&token=' + user.token;
        WeiQuPai.Util.post(url, data, function(rsp) {
            //更新本地的用户设置缓存
            user = Ext.merge(user, data);
            WeiQuPai.Cache.set('currentUser', user);
            callback && callback();
        });
    },

    //过滤对象的空值
    filterNull: function(obj) {
        var res = {};
        for (k in obj) {
            if (obj.hasOwnProperty(k) && obj[k] != null) {
                res[k] = obj[k];
            }
        }
        return res;
    },

    //生成一个展现提示信息的容器
    msgbox: function(html, cfg) {
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

    //cache数据，每种类型的cache列表最多保存100个
    cacheData: function(type, id) {
        var data = WeiQuPai.Cache.get('user_data') || {};
        if (!data[type]) {
            data[type] = [];
        }
        if (data[type].indexOf(id) != -1) return false;
        data[type].push(id);
        if (data[type].length > 100) {
            data[type].shift();
        }
        WeiQuPai.Cache.set('user_data', data);
        return true;
    },

    //是否有缓存
    hasCache: function(type, id) {
        var data = WeiQuPai.Cache.get('user_data');
        if (!data || !data[type]) return;
        return data[type].indexOf(id) != -1;
    },

    //删除
    delCache: function(type, id) {
        var data = WeiQuPai.Cache.get('user_data');
        if (!data || !data[type]) return;
        return data[type].splice(data[type].indexOf(id), 1);
    },

    //转到某个视图，并带参数
    forward: function(xtype, config) {
        var view = Ext.merge({
            xtype: xtype
        }, config);
        var main = Ext.Viewport.down('main');
        main.push(view);
    },

    //是否已拍过该商品
    hasAuction: function(auctionId) {
        var auctions = WeiQuPai.Cache.get('auctions');
        return auctions && auctions.indexOf(auctionId) != -1;
    },

    //绑定推送消息，并将deviceToken,userId等信息回传给server
    bindPush: function() {
        if (!window.BPush) return;
        var user = WeiQuPai.Cache.get('currentUser');
        BPush.bindChannel(function(data) {
            //绑定成功，但用户未登录，不需要回传
            if (!user) return;
            data.os = Ext.os.name.toLowerCase();
            var url = WeiQuPai.Config.apiUrl + '/?r=app/bindPush/&token=' + user.token;
            WeiQuPai.Util.post(url, data, function(rsp) {
                //更新本地对应的缓存数据
                user = Ext.merge(user, data);
                WeiQuPai.Cache.set('currentUser', user);
            });
        });
    },

    //保存上一个视图，解决安卓下backbutton弹层不消失的问题
    saveLastView: function() {
        if (Ext.os.is.android) {
            WeiQuPai.lastView = this;
        }
    },

    //自动消失的提示消息框
    toast: function(msg, time) {
        if (!this.globalView['toast']) {
            this.globalView['toast'] = Ext.create('WeiQuPai.plugin.Toast', {
                style: 'opacity:0'
            });
            Ext.Viewport.add(this.globalView['toast']);
        }
        toast = this.globalView['toast'];
        toast.setMessage(msg);
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }
        toast.element.setStyle('display', 'block');
        var fadeIn = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'opacity': 0
            },
            to: {
                'opacity': 1
            },
            duration: 300,
        });
        fadeIn.run(toast.element);
        this.toastTimeout = setTimeout(function() {
            var fadeOut = Ext.create('Ext.Anim', {
                autoClear: false,
                from: {
                    'opacity': 1
                },
                to: {
                    'opacity': 0
                },
                duration: 300,
                after: function() {
                    toast.element.setStyle('display', 'none')
                }
            });
            fadeOut.run(toast.element);
        }, time || 3000);
    },

    getImagePath: function(file, size) {
        //如果是绝对地址直接返回
        if (/^http:/.test(file)) return file;
        //如果不是以/开头，则是本地的相对路径
        var prefix = file.charAt(0) == '/' ? WeiQuPai.Config.host : '';
        if (!size) return prefix + file;
        var segment = file.split('/');
        var basename = segment.pop();
        var path = segment.join('/');
        return prefix + path + '/' + size + '.' + basename;
    },

    getAvatar: function(avatar, size) {
        avatar = avatar || 'resources/images/defavatar.jpg';
        return this.getImagePath(avatar, size);
    },

    showSplash: function() {
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/splashScreen&ver=' + WeiQuPai.Config.version,
            method: 'get',
            success: function(rsp) {
                var data = Ext.decode(rsp.responseText);
                if (!data) return;
                var view = Ext.create('WeiQuPai.view.SplashScreen');
                view.setPicData(data);
                Ext.Viewport.add(view);
                view.show();
                setTimeout(function() {
                    view.hide();
                }, (data.duration || 5) * 1000);
            },
            scope: this
        });
    },

    //封装ajax的请求
    request: function(url, method, data, callback) {
        if (Ext.isFunction(data)) {
            callback = data;
            data = null;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            params: data,
            success: function(rsp) {
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                callback && callback(rsp);
            },
            failure: function(rsp) {
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('数据加载失败，请重试');
            }
        });
    },

    get: function(url, callback) {
        return WeiQuPai.Util.request(url, 'get', callback);
    },

    post: function(url, data, callback) {
        return WeiQuPai.Util.request(url, 'post', data, callback);
    }
})