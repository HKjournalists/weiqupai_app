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
        'Ext.MessageBox','WeiQuPai.Config', 'WeiQuPai.Util', 'WeiQuPai.Cache'
    ],

    controllers: [
        'Main', 'Today', 'MyAuction', 'MyAuctionDetail','ItemDetail','DetailPicShow','Order', 'ShowOrder', 'Circle', 'ShowUser',
        'Shop', 'CompanyMessage', 'My', 'Setting', 'MyFriend', 'MyConsignee', 'Private', 'Login', 'Register'
    ],
    views: ['Main'],
    stores: [
        'Item','MyAuction', 'Circle', 'ShowUserInfo', 'ShowUserMessage', 'CompanyMessage', 'SiteMessage', 'UserFriend', 'UserProp', 'UserCoupon'
    ],
    icon: {
        '57': 'resources/icons/icon.png',
        '72': 'resources/icons/icon~ipad.png',
        '114': 'resources/icons/icon@2x.png',
        '144': 'resources/icons/icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/640x1096.jpg',
        '640x920': 'resources/startup/640x1096.png',
        '640x1096': 'resources/startup/640x1096.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        this.initMsgBox();

        Ext.Viewport.add(Ext.create('WeiQuPai.view.Main'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }, 

    //修改messagebox的文字
    initMsgBox: function(){
        var MB = Ext.MessageBox;
        Ext.apply(Ext.MessageBox, {
            OK    : {text: '确定',     itemId: 'ok',  ui: 'action'},
            YES   : {text: '是',    itemId: 'yes', ui: 'action'},
            NO    : {text: '否',     itemId: 'no'},
            CANCEL: {text: '取消', itemId: 'cancel'},
            OKCANCEL: [
                {text: '取消', itemId: 'cancel'},
                {text: '确定',     itemId: 'ok',  ui : 'action'}
            ],
            YESNOCANCEL: [
                {text: '取消', itemId: 'cancel'},
                {text: '否',     itemId: 'no'},
                {text: '是',    itemId: 'yes', ui: 'action'}
            ],
            YESNO: [
                {text: '否',  itemId: 'no'},
                {text: '是', itemId: 'yes', ui: 'action'}
            ]
        });
    }
});
