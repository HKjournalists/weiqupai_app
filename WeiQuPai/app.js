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
        'MyConsignee', 'MyFen', 'MyFollow', 'MyMessage', 'MyOrder', 'MyOrderDetail', 'NoticeAfter',
        'NoticeToday', 'NoticeTomorrow', 'Order', 'Pay', 'PrivateMessage', 'Profile', 'Register',
        'Routes', 'Setting', 'ShowOrder', 'ShowUser', 'ShowUserDis', 'ShowUserFeed', 'ShowUserLike',
        'Today', 'Discount', 'KillEnd', 'TopKiller', 'UserAuction', 'UserAuctionComment'
    ],
    models: [
        'Auction', 'Comment', 'Consignee', 'Feed', 'Item', 'Order', 'Profile', 'Shipment',
        'SpecialSale', 'UserAuction', 'ShowUserDis', 'ShowUserLike', 'ShowUserFeed', 'Message'
    ],
    views: [
        'Main', 'MainCard', 'StartupScreen', 'SplashScreen', 'WebPage', 'VTitleBar', 'Login', 'Register',
        'Iframe', 'SimpleViewer', 'ImageViewer', 'Sidebar', 'DisclosureItem', 'Pay', 'Order', 'Item', 'Auction', 'Item',
        'UserAuction', 'InputComment', 'CircleReplyLayer', 'CameraLayer', 'AuctionTip', 'MainTip', 'NoticeTip',
        'AuctionTipTwo', 'PriceForm'
    ],
    stores: [
        'Auction', 'Comment', 'Banner', 'MyOrder', 'MyConsignee', 'Circle', 'MyProp', 'MyCoupon',
        'Coupon', 'Prop', 'SpecialSale', 'ShowUserLike', 'ShowUserDis', 'ShowUserFeed', 'MyFollow', 'MyAuction',
        'MyFans', 'FeedReply', 'MyMessage', 'CommentReply', 'PrivateMessage', 'Discount', 'MyDiscount',
        'KillEnd', 'UserAuction', 'UserAuctionHelper'
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

        //this.catchError();

        this.hideSplash();

        //上报版本号
        this.reportVersion();

        //handle android back button
        this.handleBackButton();

        //暂停和恢复的时候
        this.handleResume();
        this.handlePause();

        //处理postMessage
        this.handlePostMessage();

        this.initMsgBox();

        //fix ios7 statusbar overlay
        if (Ext.os.is.ios && Ext.os.version.major >= 7) {
            document.body.className = 'ios7';
        }

        //bind push
        WeiQuPai.Util.bindPush();


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

    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "微趣拍更新",
            "微趣拍应用程序已经更新到最新版本，是否重新加载？",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    reportVersion: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var uid = user && user.push_user_id || 0;
        var img = new Image;
        var src = "http://www.vqupai.com/ver/i.gif?ver=" + WeiQuPai.Config.version + '&market=' + WeiQuPai.Config.market;
        src += '&os=' + Ext.os.name.toLowerCase() + '&osver=' + Ext.os.version.version;
        if (uid) src += "&push_user_id=" + uid;

        if (this.firstLaunch) src += "&first=1";
        img.src = src;
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
            var str = '';
            for (i in data) {
                str += '&' + i + '=' + encodeURIComponent(data[i])
            }
            var img = new Image;
            img.src = 'http://www.vqupai.com/ver/err.gif?' + str.substr(1);
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

    },

    handleResume: function() {
        document.addEventListener('resume', function() {
            //检查消息
            WeiQuPai.Notify.checkMQ();

            //处理刷新状态
            var mainCard = WeiQuPai.mainCard;
            var main = WeiQuPai.navigator;
            //如果是在今日，就做软刷新处理
            var today = mainCard.down('today');
            var auction = main.down('auction');
            var userAuction = main.down('userauction');
            var special = main.down('specialsale');
            if (main.getActiveItem() == detail) {
                detail.softRefresh();
                return;
            }
            if (main.getActiveItem() == special) {
                special.fireEvent('activate');
                return;
            }
            if (mainCard.getActiveItem() == today) {
                today.fireEvent('activate');
                return;
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

    //修改messagebox的文字
    initMsgBox: function() {
        var MB = Ext.MessageBox;
        Ext.apply(Ext.MessageBox, {
            OK: {
                text: '确定',
                itemId: 'ok',
                ui: 'action'
            },
            YES: {
                text: '是',
                itemId: 'yes',
                ui: 'action'
            },
            NO: {
                text: '否',
                itemId: 'no'
            },
            CANCEL: {
                text: '取消',
                itemId: 'cancel'
            },
            OKCANCEL: [{
                text: '取消',
                itemId: 'cancel'
            }, {
                text: '确定',
                itemId: 'ok',
                ui: 'action'
            }],
            YESNOCANCEL: [{
                text: '取消',
                itemId: 'cancel'
            }, {
                text: '否',
                itemId: 'no'
            }, {
                text: '是',
                itemId: 'yes',
                ui: 'action'
            }],
            YESNO: [{
                text: '否',
                itemId: 'no'
            }, {
                text: '是',
                itemId: 'yes',
                ui: 'action'
            }]
        });
    }
});