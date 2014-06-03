/**
 * 检查新消息并给用户小红点提示
 * 
 */
 Ext.define('WeiQuPai.Notify', {

 	singleton: true,
    
    //消息类型的定义
    MSG_FRIEND_REQUEST: 1,
    MSG_MESSAGE: 2,
    MSG_CIRCLE: 3,
    MSG_CIRCLE_REPLY: 4,
    MSG_CIRCLE_ZAN: 5,
    MSG_APP_UPDATE: 6,

    MSG_NEW_COUPON: 9,
    MSG_NEW_PROP: 10,
    MSG_NEW_ORDER: 11,
    MSG_ORDER_SHIP: 12,
    MSG_SPLASH: 13,

    //保存消息
    msg: {},

    //检查是否有新的消息产生
    checkMQ: function(){
        //WeiQuPai.Util.toast('检查新消息');
    	var user = WeiQuPai.Cache.get('currentUser');
    	if(!user) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/mq&token=' + user.token,
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(!rsp) return;
                for(type in rsp){
                    if(!this.msg[type]){
                        this.msg[type] = rsp[type];
                    }else{
                        Ext.isArray(this.msg[type]) ? this.msg[type] = this.msg[type].concat(rsp[type]) : this.msg[type] + rsp[type];
                    }
                	var notifier = WeiQuPai.Notify.notifier[type];
                	notifier && notifier.call(WeiQuPai.Notify, rsp[type]);
                }
            },
            scope: this
        });
    },

    //通知指定类型的消息BUTTON显示红点, 如果没有消息则不显示
    notify: function(types){
        if(!Ext.isArray(types)) types = [types];
        for(var i=0; i<types.length; i++){
            var type = types[i];
            if(!this.msg[type]) continue;
            this.notifier[type].call(this, this.msg[type]);
        }
    },

    //是否有某种类型的通知, 当有消息时，要主动刷新对应的view
    hasNotify: function(type){
        return this.msg[type] != null;
    },

    clearNotify: function(types){
        if(!Ext.isArray(types)) types = [types];
        for(var i=0; i<types.length; i++){
            var type = types[i];
            if(!this.msg[type]) continue;
            this.clearNotifier[type].call(this);
        }
    },

    //对于每种消息类型对应的处理逻辑，主要是标红点
    notifier: {},
    //清除红点用的消息处理
    clearNotifier: {},

    frNotify: function(msg){
        Ext.Viewport.down('maintab').setBadge('my');
        this.setButtonBadge(Ext.Viewport.down('my button[action=friend]'));
        var nf = Ext.Viewport.down('disclosureitem[itemId=newFriend]');
        nf && nf.setBadge();
    },

    frClear: function(){
        Ext.Viewport.down('maintab').clearBadge('my');
        this.clearButtonBadge(Ext.Viewport.down('my button[action=friend]'));
        var nf = Ext.Viewport.down('disclosureitem[itemId=newFriend]');
        nf && nf.clearBadge();
        //清除对应的消息
        this.msg[this.MSG_FRIEND_REQUEST] = null;
    },

    msgNotify: function(msg){
        Ext.Viewport.down('maintab').setBadge('my');
    },

    msgClear: function(){
        Ext.Viewport.down('maintab').clearBadge('my');
        //清除对应的消息
        this.msg[this.MSG_MESSAGE] = null;
    },

    circleNotify: function(msg){
        //如果当前是拍圈就剧新
        var activeView = Ext.Viewport.down('main').getActiveItem();
        var mainTab = Ext.Viewport.down('maintab');
        var circle = Ext.Viewport.down('circle');
        circle.setForceReload(true);
        if(activeView == mainTab && mainTab.getActiveItem() == circle){
            circle.loadData();
        }else{
            Ext.Viewport.down('maintab').setBadge('circle');
        }
    },

    circleClear: function(){
        Ext.Viewport.down('maintab').clearBadge('circle');
        //清除对应的消息
        this.msg[this.MSG_CIRCLE] = null;
    },

    circleReplyNotify: function(msg){
        this.circleNotify(msg);
    },

    circleReplyClear: function(){
        this.circleClear();
        //清除对应的消息
        this.msg[this.MSG_CIRCLE_REPLY] = null;
    },

    circleZanNotify: function(msg){
        this.circleNotify(msg);
    },

    circleZanClear: function(){
        this.circleClear();
        //清除对应的消息
        this.msg[this.MSG_CIRCLE_ZAN] = null;
    },

    appUpdateNotify: function(msg){
        Ext.Viewport.down('maintab').setBadge('my');
        this.setButtonBadge(Ext.Viewport.down('my button[action=setting]'));
        var nf = Ext.Viewport.down('disclosureitem[itemId=update]');
        nf && nf.setBadge();
    },

    appUpdateClear: function(){
        Ext.Viewport.down('maintab').clearBadge('my');
        this.clearButtonBadge(Ext.Viewport.down('my button[action=setting]'));
        Ext.Viewport.down('disclosureitem[itemId=update]').clearBadge();
        //清除对应的消息
        this.msg[this.MSG_APP_UPDATE] = null;
    },

    //新拍券
    newCouponNotify: function(){
        Ext.Viewport.down('maintab').setBadge('my');
        this.setButtonBadge(Ext.Viewport.down('my button[action=coupon]'));
    },

    newCouponClear: function(){
        Ext.Viewport.down('maintab').clearBadge('my');
        this.clearButtonBadge(Ext.Viewport.down('my button[action=coupon]'));
        //清除对应的消息
        this.msg[this.MSG_NEW_COUPON] = null;
    },

    //新道具
    newPropNotify: function(){
        Ext.Viewport.down('maintab').setBadge('my');
        this.setButtonBadge(Ext.Viewport.down('my button[action=prop]'));
    },

    newPropClear: function(){
        Ext.Viewport.down('maintab').clearBadge('my');
        this.clearButtonBadge(Ext.Viewport.down('my button[action=prop]'));
        this.msg[this.MSG_NEW_PROP] = null;
    },

    //新订单
    newOrderNotify: function(){
        var msg = this.msg[this.MSG_NEW_ORDER];
        if(!msg || msg.length == 0) return;
        Ext.Viewport.down('maintab').setBadge('myauction');
        //给每个订单标红点
        var myauction = Ext.Viewport.down('myauction');
        for(var i=0; i<msg.length; i++){
            myauction.setBadge(msg[i]);
        }
    },

    newOrderClear: function(id){
        var msg = this.msg[this.MSG_NEW_ORDER];
        if(!msg || msg.length ==0) return;
        Ext.Viewport.down('maintab').clearBadge('myauction');
        //给某个订单清除红点
        var myauction = Ext.Viewport.down('myauction');
        myauction.clearBadge(id);
        var idx = msg.indexOf(id);
        idx >= 0  && msg.splice(idx, 1);
    },

    //订单已发货
    orderShipNotify: function(){
        var msg = this.msg[this.MSG_ORDER_SHIP];
        if(!msg || msg.length == 0) return;

        Ext.Viewport.down('maintab').setBadge('myauction');
        //给每个订单标红点
        var myauction = Ext.Viewport.down('myauction');
        for(var i=0; i<msg.length; i++){
            myauction.setBadge(msg[i]);
        }
    },

    orderShipClear: function(id){
        var msg = this.msg[this.MSG_ORDER_SHIP];
        if(!msg || msg.length == 0) return;

        Ext.Viewport.down('maintab').clearBadge('myauction');
        //给某个订单清除红点
        var myauction = Ext.Viewport.down('myauction');
        myauction.clearBadge(id);
        var idx = msg.indexOf(id);
        idx >= 0  && msg.splice(idx, 1);
    },

    //显示闪屏
    flashNotify: function(){
        WeiQuPai.Util.showSplash();
    },

    //闪屏不需要清除红点
    flashClear: function(){},

    setButtonBadge: function(btn){
        btn.badgeElement.setStyle('display', 'block');
        btn.setBadgeCls('x-badge w-badge-mdot');
        btn.element.addCls('x-hasbadge');
    },

    clearButtonBadge: function(btn){
        btn.badgeElement.setStyle('display', 'none');
        btn.element.removeCls('x-hasbadge');
    }
 });

 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_FRIEND_REQUEST] = WeiQuPai.Notify.frNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_MESSAGE] = WeiQuPai.Notify.msgNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_CIRCLE] = WeiQuPai.Notify.circleNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_CIRCLE_REPLY] = WeiQuPai.Notify.circleReplyNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_CIRCLE_ZAN] = WeiQuPai.Notify.circleZanNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_APP_UPDATE] = WeiQuPai.Notify.appUpdateNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_NEW_COUPON] = WeiQuPai.Notify.newCouponNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_NEW_PROP] = WeiQuPai.Notify.newPropNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_NEW_ORDER] = WeiQuPai.Notify.newOrderNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_ORDER_SHIP] = WeiQuPai.Notify.orderShipNotify;
 WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_SPLASH] = WeiQuPai.Notify.flashNotify;

 //取消红点的notifier
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_FRIEND_REQUEST] = WeiQuPai.Notify.frClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_MESSAGE] = WeiQuPai.Notify.msgClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_CIRCLE] = WeiQuPai.Notify.circleClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_CIRCLE_REPLY] = WeiQuPai.Notify.circleReplyClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_CIRCLE_ZAN] = WeiQuPai.Notify.circleZanClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_APP_UPDATE] = WeiQuPai.Notify.appUpdateClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_NEW_COUPON] = WeiQuPai.Notify.newCouponClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_NEW_PROP] = WeiQuPai.Notify.newPropClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_NEW_ORDER] = WeiQuPai.Notify.newOrderClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_ORDER_SHIP] = WeiQuPai.Notify.orderShipClear;
 WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_SPLASH] = WeiQuPai.Notify.flashClear;
