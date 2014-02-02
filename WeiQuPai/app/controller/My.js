Ext.define('WeiQuPai.controller.My', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		friendBtn: 'iconbutton[action=friend]',
    		accountBtn: 'iconbutton[action=account]',
    		consigneeBtn: 'iconbutton[action=consignee]',
    		propBtn: 'iconbutton[action=prop]',
    		couponBtn: 'iconbutton[action=coupon]',
    		settingBtn: 'iconbutton[action=setting]',
    		my: 'my'
    	},
        control: {
        	friendBtn: {tap:'showFriend'}, 
        	accountBtn: {tap: 'showAccount'},
        	orderBtn: {tap: 'showOrder'}, 
        	consigneeBtn: {tap: 'showConsignee'}, 
        	propBtn: {tap: 'showProp'}, 
        	couponBtn: {tap: 'showCoupon'},
        	settingBtn: {tap: 'showSetting'}
        }
    },

    showFriend: function(){
    	var view = Ext.create('WeiQuPai.view.MyFriend');
    	this.getMain().push(view);
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
    }
});
