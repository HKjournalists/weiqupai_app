Ext.define('WeiQuPai.controller.My', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		friendBtn: 'button[action=friend]',
            feedBtn: 'button[action=feed]',
    		accountBtn: 'button[action=account]',
    		consigneeBtn: 'button[action=consignee]',
    		propBtn: 'button[action=prop]',
    		couponBtn: 'button[action=coupon]',
    		settingBtn: 'button[action=setting]',
            profile: 'disclosureitem[itemId=profile]',
    		my: 'my'
    	},
        control: {
        	friendBtn: {tap:'showFriend'}, 
        	accountBtn: {tap: 'showAccount'},
        	orderBtn: {tap: 'showOrder'}, 
        	consigneeBtn: {tap: 'showConsignee'}, 
        	propBtn: {tap: 'showProp'}, 
        	couponBtn: {tap: 'showCoupon'},
        	settingBtn: {tap: 'showSetting'},
            profile: {tap: 'showProfile'},
            feedBtn: {tap: 'showFeed'},
        }
    },

    showFriend: function(){
    	var view = Ext.create('WeiQuPai.view.MyFriend');
    	this.getMain().push(view);
    },

    showFeed: function(){
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        WeiQuPai.Util.forward('showuser', {param: user.id})
    },

    showAccount: function(){
        var view = Ext.create('WeiQuPai.view.MyAccount');
        this.getMain().push(view);
    },

    showConsignee: function(){
        var view = Ext.create('WeiQuPai.view.MyConsignee');
        this.getMain().push(view);
    },

    showProp: function(){
        var view = Ext.create('WeiQuPai.view.MyProp');
        this.getMain().push(view);
    },

    showCoupon: function(){
        var view = Ext.create('WeiQuPai.view.MyCoupon');
        this.getMain().push(view);
    },

    showSetting: function(){
        var view = Ext.create('WeiQuPai.view.Setting');
        this.getMain().push(view);
    },

    showProfile: function(){
        var view = Ext.create('WeiQuPai.view.Profile');
        this.getMain().push(view);
    }
});
