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
        'Ext.MessageBox','WeiQuPai.Config', 'WeiQuPai.Util', 'WeiQuPai.Notify', 'WeiQuPai.Cache', 'WeiQuPai.plugin.ListPaging', 
        'WeiQuPai.plugin.PullRefresh', 'WeiQuPai.plugin.LoadMask', 'WeiQuPai.view.StartupScreen', 'WeiQuPai.view.SplashScreen',
        'WeiQuPai.view.WebPage', 'Ext.Anim'
    ],

    controllers: [
        'Main', 'Today', 'MyAuction', 'MyAuctionDetail','ItemDetail','Order', 'ShowOrder', 'Circle', 'ShowUser',
        'My', 'Setting', 'MyFriend', 'MyConsignee', 'Private', 'NewMessage', 'Login', 'Register', 'Profile', 'CameraLayer',
        'NewFriend', 'Routes', 'SpecialSale'
    ],
    views: ['Main'],
    stores: [
        'Auction', 'AuctionComment', 'Banner', 'MyAuction', 'UserConsignee', 'Circle', 'UserFeed', 'UserFriend', 'UserProp', 'UserCoupon',
        'FriendRequest', 'SpecialSale'
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
        'resources/images/splash2.png'
    ],

    //是否第一次加载
    firstLaunch: null,

    launch: function() {
        var ver = WeiQuPai.Config.version;
        var flag = WeiQuPai.Cache.get('appver');
        this.firstLaunch = !flag || flag != ver;

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
        if(Ext.os.is.ios && Ext.os.version.major >= 7){
            document.body.className = 'ios7';
        }

        //bind push
        WeiQuPai.Util.bindPush();


        //startup screen
        if(this.firstLaunch){
            WeiQuPai.Cache.set('appver', ver);
            var view = Ext.create('WeiQuPai.view.StartupScreen'); 
            view.setPicData(this.startupScreen);
            Ext.Viewport.add(view);
            view.show();
        }

        Ext.Viewport.add(Ext.create('WeiQuPai.view.Main'));

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

    reportVersion: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        var uid = user && user.push_user_id || 0;
        var img = new Image;
        var src = "http://www.vqupai.com/ver/i.gif?ver=" + WeiQuPai.Config.version + '&market=' + WeiQuPai.Config.market;
        if(uid) src += "&push_user_id=" + uid;
        if(this.firstLaunch) src += "&first=1";
        img.src = src;
    },

    hideSplash: function(){
        setTimeout(function(){
            navigator.splashscreen && navigator.splashscreen.hide();
        }, 1000);
    },

    handleBackButton: function(){
        if(!Ext.os.is.android) return;
        document.addEventListener('backbutton', function(e){
            if(WeiQuPai.lastView){
                WeiQuPai.lastView.hide();
                delete WeiQuPai.lastView;
                return;
            }
            var nav = Ext.Viewport.down('main');
            nav.getInnerItems().length == 1 ? navigator.app.exitApp() : nav.pop();
        }, false);
    },

    handlePause: function(){
        
    },

    handleResume: function(){
        document.addEventListener('resume', function(){
            //检查消息
            WeiQuPai.Notify.checkMQ();

            //处理刷新状态
            var mainTab = Ext.Viewport.down('maintab');
            var main = Ext.Viewport.down('main');
            //如果是在今日，就做软刷新处理
            var today = mainTab.down('today');
            var detail = main.down('itemdetail');
            var special = main.down('specialsale');
            if(main.getActiveItem() == detail){
                detail.softRefresh();
                return;
            }
            if(main.getActiveItem() == special){
                special.fireEvent('activate');
                return;
            }
            if(mainTab.getActiveItem() == today){
                today.fireEvent('activate');
                return;
            }
        }, false);
    },

    handlePostMessage: function(){
        window.addEventListener('message', function(e){
            //如果hash一样，android上不能发生跳转,需要手动触发
            if(location.hash.substr(1) == e.data){
                WeiQuPai.app.getHistory().fireEvent('change', e.data); 
            }else{
                location.hash = e.data;
            }
        }, false);
    },

    //修改messagebox的文字
    initMsgBox: function(){
        var MB = Ext.MessageBox;
        Ext.apply(Ext.MessageBox, {
            OK    : {text: '确定', itemId: 'ok',  ui: 'action'},
            YES   : {text: '是', itemId: 'yes', ui: 'action'},
            NO    : {text: '否', itemId: 'no'},
            CANCEL: {text: '取消', itemId: 'cancel'},
            OKCANCEL: [
                {text: '取消', itemId: 'cancel'},
                {text: '确定', itemId: 'ok',  ui : 'action'}
            ],
            YESNOCANCEL: [
                {text: '取消', itemId: 'cancel'},
                {text: '否', itemId: 'no'},
                {text: '是', itemId: 'yes', ui: 'action'}
            ],
            YESNO: [
                {text: '否',  itemId: 'no'},
                {text: '是', itemId: 'yes', ui: 'action'}
            ]
        });
    }
});
