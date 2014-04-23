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
        'Ext.MessageBox','WeiQuPai.Config', 'WeiQuPai.Util', 'WeiQuPai.Cache', 'WeiQuPai.plugin.ListPaging', 
        'WeiQuPai.plugin.PullRefresh', 'WeiQuPai.plugin.LoadMask', 'WeiQuPai.view.StartupScreen', 'WeiQuPai.view.SplashScreen',
        'WeiQuPai.view.WebPage', 'Ext.Anim'
    ],

    controllers: [
        'Main', 'Today', 'MyAuction', 'MyAuctionDetail','ItemDetail','Order', 'ShowOrder', 'Circle', 'ShowUser',
        'My', 'Setting', 'MyFriend', 'MyConsignee', 'Private', 'NewMessage', 'Login', 'Register', 'Profile', 'CameraLayer',
        'NewFriend'
    ],
    views: ['Main'],
    stores: [
        'Auction', 'AuctionComment', 'Banner', 'MyAuction', 'UserConsignee', 'Circle', 'UserFeed', 'UserFriend', 'UserProp', 'UserCoupon',
        'FriendRequest'
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
        'resources/images/splash1.jpg', 
        'resources/images/splash2.jpg', 
        'resources/images/splash3.jpg' 
    ],

    launch: function() {

        this.hideSplash();

        //上报版本号
        this.reportVersion();

        //handle android back button
        this.handelBackButton();

        this.initMsgBox();

        //fix ios7 statusbar overlay
        if(Ext.os.is.ios && Ext.os.version.major >= 7){
            document.body.className = 'ios7';
        }


        //bind push
        WeiQuPai.Util.bindPush();

        //startup screen
        var ver = WeiQuPai.Config.version;
        var flag = WeiQuPai.Cache.get('appver');
        if(!flag || flag != ver){
            WeiQuPai.Cache.set('appver', ver);
            var view = Ext.create('WeiQuPai.view.StartupScreen'); 
            view.setPicData(this.startupScreen);
            Ext.Viewport.add(view);
            Ext.Viewport.add(Ext.create('WeiQuPai.view.Main'));
        }else{
            //splash screen
            var self = this;
            WeiQuPai.Util.loadSplash(function(data){
                if(data && data.enable){
                    var view = Ext.create('WeiQuPai.view.SplashScreen');
                    view.setPicData(data);
                    Ext.Viewport.add(view);
                    setTimeout(function(){
                        Ext.Viewport.setActiveItem('main');
                    }, (data.duration || 5) * 1000);
                }
                Ext.Viewport.add(Ext.create('WeiQuPai.view.Main'));
            });
        }

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
        var img = new Image;
        img.src = "http://www.vqupai.com/ver/i.gif?ver=" + WeiQuPai.Config.version;
    },

    hideSplash: function(){
        setTimeout(function(){
            navigator.splashscreen && navigator.splashscreen.hide();
        }, 1000);
    },

    handelBackButton: function(){
        if(!Ext.os.is.android) return;
        document.addEventListener('backbutton', function(e){
            var nav = Ext.Viewport.down('main');
            nav.getInnerItems().length == 1 ? navigator.app.exitApp() : nav.pop();
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
