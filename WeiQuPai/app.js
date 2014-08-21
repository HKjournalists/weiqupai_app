/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
Ext.application({
    name: 'WeiQuPai',

    requires: [
        'Ext.MessageBox', 'WeiQuPai.Config', 'WeiQuPai.Util', 'WeiQuPai.Notify', 'WeiQuPai.Cache',
        'WeiQuPai.plugin.ListPaging', 'WeiQuPai.plugin.PullRefresh', 'WeiQuPai.plugin.LoadMask',
        'WeiQuPai.plugin.Toast', 'Ext.Anim', 'Ext.device.Camera', 'Ext.field.Select',
        'Ext.form.FieldSet', 'Ext.Img', 'Ext.ux.ImageViewer', 'Ext.field.Hidden'
    ],

    controllers: [
        'Auction', 'CameraLayer', 'Circle', 'Comment', 'CommentList', 'Feed', 'Login', 'Main', 'MyAuction',
        'MyConsignee', 'MyFen', 'MyFollow', 'MyMessage', 'MyOrder', 'MyOrderDetail', 'Order', 'Pay',
        'PrivateMessage', 'Profile', 'Register', 'Routes', 'Setting', 'ShowOrder', 'ShowUser', 'ShowUserDis', 'ShowUserFeed', 'ShowUserLike',
        'Today', 'Discount', 'KillEnd', 'TopKiller', 'UserAuction', 'UserAuctionComment', 'MyDiscount', 'FeedBack'
    ],
    models: [
        'Auction', 'Comment', 'Consignee', 'Feed', 'Item', 'Order', 'Profile', 'Shipment',
        'SpecialSale', 'UserAuction', 'ShowUserDis', 'ShowUserLike', 'ShowUserFeed', 'Message',
        'Discount'
    ],
    views: [
        'Main', 'MainCard', 'StartupScreen', 'SplashScreen', 'WebPage', 'VTitleBar', 'Login', 'Register',
        'Iframe', 'SimpleViewer', 'ImageViewer', 'Sidebar', 'DisclosureItem', 'Pay', 'Order', 'Item', 'Auction', 'Item',
        'UserAuction', 'InputComment', 'CircleReplyLayer', 'CameraLayer', 'AuctionTip', 'MainTip', 'NoticeTip',
        'AuctionTipTwo', 'PriceForm', 'DeleteButtonLayer', 'ConfirmLayer'
    ],
    stores: [
        'Auction', 'Comment', 'Banner', 'MyOrder', 'MyConsignee', 'Circle', 'MyProp', 'MyCoupon',
        'Coupon', 'Prop', 'SpecialSale', 'ShowUserLike', 'ShowUserDis', 'ShowUserFeed', 'MyFollow', 'MyAuction',
        'MyFans', 'FeedReply', 'MyMessage', 'CommentReply', 'PrivateMessage', 'Discount', 'MyDiscount',
        'KillEnd', 'UserAuction', 'UserAuctionHelper', 'Category', 'CategoryItem', 'UserAuctionComment'
    ],
    icon: {
        '57': 'resources/icons/icon.png',
        '72': 'resources/icons/icon~ipad.png',
        '114': 'resources/icons/icon@2x.png',
        '144': 'resources/icons/icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/loading/Default.png', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/loading/Default@2x.png', // Retina iPhone and iPod touch
        '640x1136': 'resources/loading/Default-568h@2x.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/Default-Portrait~ipad.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/loading/Default-Landscape~ipad.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/Default-Portrait@2x~ipad.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/Default-Landscape@2x~ipad.png' // : Retina iPad (third generation) in landscape orientation
    },

    startupScreen: [
        'resources/images/splash1.png',
        'resources/images/splash2.png',
        'resources/images/splash3.png',
        'resources/images/splash4.png',
        'resources/images/splash5.png'
    ],

    //是否第一次加载
    firstLaunch: null,

    launch: function() {
        var ver = WeiQuPai.Config.version;
        var flag = WeiQuPai.Cache.get('appver');
        this.firstLaunch = !flag || flag != ver;

        //bind push
        WeiQuPai.Util.bindPush();

        //this.catchError();

        this.hideSplash();

        //handle android back button
        this.handleBackButton();

        //暂停和恢复的时候
        this.handleResume();
        this.handlePause();

        //处理postMessage
        this.handlePostMessage();

        //fix ios7 statusbar overlay
        if (Ext.os.is.ios && Ext.os.version.major >= 7) {
            document.body.className = 'ios7';
        }

        //startup screen
        if (this.firstLaunch) {
            WeiQuPai.Cache.set('appver', ver);
            var view = Ext.create('WeiQuPai.view.StartupScreen');
            view.setPicData(this.startupScreen);
            Ext.Viewport.add(view);
            view.show();
        }

        WeiQuPai.navigator = Ext.create('WeiQuPai.view.Main');
        Ext.Viewport.add(WeiQuPai.navigator);

        //检查消息
        WeiQuPai.Notify.checkMQ();

        //5秒后再上报,防止没有device_token
        setTimeout(function() {
            WeiQuPai.app.statReport({
                act: 'startup'
            });
        }, 5000);
    },

    //统计上报
    statReport: function(data) {
        var data = data || {};
        //是否首次启动
        if (this.firstLaunch) {
            data['first'] = 1;
        }
        data['sw'] = screen.width;
        data['sh'] = screen.height;
        data['t'] = Math.floor(new Date / 1000);
        data['ver'] = WeiQuPai.Config.version;
        data['os'] = Ext.os.name.toLowerCase();
        data['osver'] = Ext.os.version.version;
        data['device'] = WeiQuPai.Cache.get('device') || '';
        data['market'] = WeiQuPai.Config.market;
        var user = WeiQuPai.Cache.get('currentUser');
        if (user) {
            data['uname'] = user.uname;
            data['uid'] = user.id;
        }
        var img = new Image;
        var url = 'http://www.vqupai.com/ver/i.gif?' + Ext.Object.toQueryString(data);
        img.src = url;
    },

    catchError: function() {
        window.onerror = function(msg, url, line, column, err) {
            var data = {};
            data['msg'] = msg;
            data['line'] = line;
            if (column) {
                data['column'] = column;
            }
            if (err) {
                data['stack'] = err.stack;
            }
            var user = WeiQuPai.Cache.get('currentUser');
            if (user) data['u'] = user.uname;
            data['dsp'] = screen.width + 'x' + screen.height;
            data['ver'] = WeiQuPai.Config.version;
            data['os'] = Ext.os.name.toLowerCase();
            data['osver'] = Ext.os.version.version;
            data['market'] = WeiQuPai.Config.market;
            var query = Ext.Object.toQueryString(data);
            var img = new Image;
            img.src = 'http://www.vqupai.com/ver/err.gif?' + query;
            return true;
        }
    },

    hideSplash: function() {
        setTimeout(function() {
            navigator.splashscreen && navigator.splashscreen.hide();
        }, 1000);
    },

    handleBackButton: function() {
        if (!Ext.os.is.android) return;
        document.addEventListener('backbutton', function(e) {
            if (WeiQuPai.lastView) {
                WeiQuPai.lastView.hide();
                delete WeiQuPai.lastView;
                return;
            }
            var nav = Ext.Viewport.down('main');
            nav.getInnerItems().length == 1 ? navigator.app.exitApp() : nav.pop();
        }, false);
    },

    handlePause: function() {
        document.addEventListener('pause', function() {
            WeiQuPai.app.statReport({
                act: 'pause'
            });
        }, false);
    },

    handleResume: function() {
        document.addEventListener('resume', function() {
            //上报统计
            WeiQuPai.app.statReport({
                act: 'resume'
            });

            //检查消息
            WeiQuPai.Notify.checkMQ();

            //处理评分
            WeiQuPai.app.tipScore();

            //处理刷新状态
            var mainCard = WeiQuPai.mainCard;
            var currentView = WeiQuPai.navigator.getActiveItem();
            if (currentView == mainCard) {
                currentView = mainCard.getActiveItem();
            }
            var today = mainCard.down('today');
            var auction = main.down('auction');
            var userAuction = main.down('userauction');
            var special = main.down('specialsale');

            if (currentView == auction) {
                currentView.softRefresh();
            } else if (currentView == special) {
                currentView.fireEvent('activate');
            } else if (currentView == today) {
                currentView.fireEvent('activate');
            } else if (currentView == userAuction) {
                currentView.loadData();
            }


        }, false);

    },

    handlePostMessage: function() {
        window.addEventListener('message', function(e) {
            if (!e.data) return;
            //对象的处理逻辑
            if (Ext.isObject(e.data)) {
                var action = e.data['action'];
                var controller = WeiQuPai.app.getController('Routes');
                controller[action] && controller[action](e.data);
                return;
            }
            //sencha自己的message不响应
            if (e.data.substr(0, 3) == 'Ext') return;
            WeiQuPai.app.getHistory().fireEvent('change', e.data);
        }, false);
    },

    //提醒评分
    tipScore: function() {
        if (!Ext.os.is.ios) return;
        var tipScore = WeiQuPai.Cache.get('tipScore');
        var now = +new Date;
        if (!tipScore) {
            tipScore = {};
            tipScore.times = 1;
        } else {
            tipScore.times++;
        }

        //上次提醒时间是否过去一周
        if (tipScore.lastTime && now - tipScore.lastTime < 7 * 86400 * 1000) return;
        //是否已经超过4次
        if (tipScore.times >= 4) return;

        tipScore.lastTime = now;
        WeiQuPai.Cache.set('tipScore', tipScore);


        Ext.MessageBox.YESNO = [{
            text: '否',
            itemId: 'no'
        }, {
            text: '是',
            itemId: 'yes',
            ui: 'action'
        }];
        Ext.Msg.confirm(null, '亲，帮忙去给评个分吧？', function(btn) {
            if (btn == "yes") {
                var url = "https://itunes.apple.com/cn/app/wei-qu-pai/id863434938?ls=1&mt=8";
                window.open(url, '_system');
            }
        });
    }
});