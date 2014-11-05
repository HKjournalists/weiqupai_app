Ext.define("WeiQuPai.Util", {
    singleton: true,
    globalView: {},
    createOverlay: function(com, conf) {
        if (this.globalView[com]) return this.globalView[com];
        var config = {
            bottom: 0,
            left: 0,
            hidden: true,
            width: '100%',
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
    slideLeft: function() {
        this.element.show();
        Ext.Anim.run(this.element, 'slide', {
            direction: 'left',
            out: false
        });
        this.getModal().setHidden(false);
    },

    slideRight: function() {
        Ext.Anim.run(this.element, 'slide', {
            direction: 'right',
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
        var cameraLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.CameraLayer');
        cameraLayer.setPicWidth(picWidth);
        cameraLayer.setPicHeight(picHeight);
        cameraLayer.setCrop(crop);
        cameraLayer.setCallback(callback);
        cameraLayer.show();
        return cameraLayer;
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
                var view = Ext.create('WeiQuPai.view.Login');
                WeiQuPai.navigator.push(view);
            });
            return false;
        }
        return true;
    },

    login: function(uname, password, callback) {
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/login',
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
        WeiQuPai.Cache.set('user_data', data.user_data);

        //注册之后绑定推送
        WeiQuPai.Util.bindPush();

        //更新sidebar的状态
        WeiQuPai.sidebar.updateUserInfo();

        callback && callback();
    },

    register: function(data, callback) {
        //注册的时候绑定市场
        data.market = WeiQuPai.Config.market;
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/join',
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

                //更新sidebar的状态
                WeiQuPai.sidebar.updateUserInfo();

                callback && callback();
            },
            failure: function(rsp) {
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('注册失败, 请重试');
            }
        });
    },

    logout: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        if (user) {
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=appv2/logout&token=' + user.token,
                method: 'get'
            });
            //删除用户相关的cache
            WeiQuPai.Util.clearCache();
        }
        var layout = WeiQuPai.mainCard.getLayout();
        var animation = new Ext.fx.layout.Card('fade');
        animation.setLayout(layout);
        animation.on('animationend', function() {
            animation.destroy();
        });
        WeiQuPai.sidebar.updateUserInfo();
        WeiQuPai.sidebar.destroyLoginView();
        WeiQuPai.sidebar.activeTabItem('today');
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

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/profile/update&token=' + user.token;
        WeiQuPai.Util.post(url, data, function(rsp) {
            //更新本地的用户设置缓存
            user = Ext.merge(user, data);
            WeiQuPai.Cache.set('currentUser', user);
            WeiQuPai.sidebar.updateUserInfo();
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
        html = html || null;
        var config = {
            // cls: 'w-empty',
            cls: 'empty',
            html: html,
            itemId: 'msgbox',
            scrollDock: 'top',
            hidden: true
        };
        config = Ext.merge(config, cfg);
        return Ext.create('Ext.Container', config);
    },
    //更新用户个人资料的缓存
    updateUserCache: function(field, value) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (Ext.isObject(field)) {
            user = Ext.merge(user, field);
        } else {
            user[field] = value;
        }
        WeiQuPai.Cache.set('currentUser', user);
    },

    clearCache: function() {
        WeiQuPai.Cache.remove('currentUser');
        WeiQuPai.Cache.remove('user_data');
    },
    //cache数据，每种类型的cache列表最多保存100个
    setCache: function(type, id) {
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
        data[type].splice(data[type].indexOf(id), 1);
        WeiQuPai.Cache.set('user_data', data);
    },

    //是否已拍过该商品
    hasAuction: function(auctionId) {
        var auctions = WeiQuPai.Cache.get('auctions');
        return auctions && auctions.indexOf(auctionId) != -1;
    },

    //绑定推送消息，并将deviceToken,userId等信息回传给server
    bindPush: function(callback) {
        if (!window.BPush) return;
        var user = WeiQuPai.Cache.get('currentUser');
        BPush.bindChannel(function(data) {
            //有回调
            Ext.isFunction(callback) && callback(data);

            //绑定成功，但用户未登录，不需要回传
            if (!data.userId || !user) return;
            data.os = Ext.os.name.toLowerCase();
            data.market = WeiQuPai.Config.market;
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/bindPush/&token=' + user.token;
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
        if (!prefix || !size) {
            return prefix + file;
        }
        var segment = file.split('/');
        var basename = segment.pop();
        var path = segment.join('/');
        return prefix + path + '/' + size + '.' + basename;
    },

    getAvatar: function(avatar, size) {
        if (!avatar) {
            var idx = Math.ceil(Math.random() * 5);
            return 'resources/images/defavatar' + idx + '.png';
        }
        return this.getImagePath(avatar, size);
    },

    showSplash: function() {
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/splashScreen&ver=' + WeiQuPai.Config.version,
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

    /**
     * 跳转到拍品详情, 根据item舞台的数据跳到不同的页面
     * 如果有拍卖，跳到拍卖，如果有一拍到底，跳到一拍到底，否则，跳到拍品详情
     * fromUserAuction 表示是否从血战到底过来, 从血战到底过来的不需要在拍品详情里显示提示
     */
    goItemView: function(item_id, fromUserAuction) {
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/item&id=' + item_id;
        WeiQuPai.Util.get(url, function(rsp) {
            var view, item = Ext.create('WeiQuPai.model.Item', rsp);
            if (item.get('auction')) {
                view = Ext.create('WeiQuPai.view.Auction');
            } else if (fromUserAuction) {
                view = Ext.create('WeiQuPai.view.UserAuctionItem');
            } else{
                view = Ext.create('WeiQuPai.view.Item');
            }
            view.setRecord(item);
            setTimeout(function() {
                WeiQuPai.navigator.push(view);
            }, 0);
        }, {
            mask: true
        });
    },

    formatTime: function(secs) {
        var def = [86400, 3600, 60];
        var fmt = ['天', '小时', '分'];
        var res = '';
        for (var i = 0; i < def.length; i++) {
            v = Math.floor(secs / def[i]);
            secs = secs % def[i];
            if (v > 0) {
                res += v + fmt[i];
            }
        }
        return res;
    },

    //重置listPaging的状态,一般只在下拉刷新是手动处理store数据的时候才会需要
    resetListPaging: function(list) {
        list.getStore().currentPage = 1;
        var plugins = list.getPlugins();
        for (var i = 0; i < plugins.length; i++) {
            if (Ext.getClassName(plugins[i]) != 'WeiQuPai.plugin.ListPaging') {
                continue;
            }
            if (list.getStore().getCount() < list.getStore().getPageSize()) {
                plugins[i].getLoadMoreCmp().hide();
                plugins[i].setIsFullyLoaded(true);
            } else {
                plugins[i].getLoadMoreCmp().show();
                plugins[i].setIsFullyLoaded(false);
            }
        }
    },

    //点赞的时候心的动画
    heartBeat: function(el) {
        setTimeout(function() {
            var outAnim = Ext.create('Ext.Anim', {
                from: {
                    '-webkit-transform': 'scale(1)',
                },
                to: {
                    '-webkit-transform': 'scale(1.4)',
                },
                duration: 200,
                after: function() {
                    inAnim.run(el);
                }
            });
            var inAnim = Ext.create('Ext.Anim', {
                from: {
                    '-webkit-transform': 'scale(1.4)',
                },
                to: {
                    '-webkit-transform': 'scale(1)',
                },
                duration: 100
            });
            outAnim.run(el);
        }, 20);
    },

    //封装ajax的请求
    request: function(url, method, data, callback, option) {
        option = option || {};
        if (option.mask) {
            WeiQuPai.Util.mask();
        }
        var request = {
            url: url,
            method: method,
            params: data,
            success: function(rsp) {
                if (option.mask) {
                    WeiQuPai.Util.unmask();
                }
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
                var msg = option.failMsg || '数据加载失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        }
        if (option.scope) {
            request.scope = option.scope;
        }
        return Ext.Ajax.request(request);
    },

    get: function(url, callback, option) {
        return WeiQuPai.Util.request(url, 'get', null, callback, option);
    },

    post: function(url, data, callback, option) {
        return WeiQuPai.Util.request(url, 'post', data, callback, option);
    },

    //列表加载完数据执行的回调
    onStoreLoad: function(store, records, operation, success) {
        if (!success) {
            WeiQuPai.Util.toast('数据加载失败');
            return false;
        }
        if (this.msgbox) {
            store.getCount() == 0 ? this.msgbox.show() : this.msgbox.hide();
        }
    },

    addTopIcon: function(container) {
        if (!container.getScrollable()) return;
        var topIcon = {
            xtype: 'button',
            baseCls: 'icontop',
            itemId: 'icontop',
            action: 'icontop',
            docked: 'bottom',
            hidden: true
        };
        container.add(topIcon);
        var scroller = container.getScrollable().getScroller();
        var topBtn = container.down('button[action=icontop]');
        topBtn.on('tap', function() {
            scroller.scrollTo(0, 0, {
                duration: 300
            });
        }, container);

        scroller.addListener('scroll', function(scroller, x, y) {
            topBtn.setHidden(y < screen.height);
        }, container);
    },

    //检查是否有全局的tips
    checkTip: function(){
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/messageTip';

        WeiQuPai.Util.get(url, function(rsp){
            if(!rsp) return;

            var tipCache = WeiQuPai.Cache.get('tips') || [];
            if(tipCache.indexOf(rsp.id) != -1) return;
            tipCache.push(rsp.id);
            WeiQuPai.Cache.set('tips', tipCache);
            
            var box = WeiQuPai.Util.getGlobalView('WeiQuPai.view.TipBox');
            box.setData(rsp);
            box.show();
        });
    }
})