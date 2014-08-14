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
    //用户关注
    MSG_FOLLOW: 14,
    //拍卖开始
    MSG_AUCTION_START: 15,
    //拍卖结束
    MSG_AUCTION_FINISH: 16,
    //拍卖到达底价
    MSG_AUCTION_RESERVE_PRICE: 17,
    //拍卖变价
    MSG_AUCTION_CHANGE_PRICE: 18,
    //有人帮拍
    MSG_USER_AUCTION_HELP: 19,

    //保存消息
    msg: {},

    //检查是否有新的消息产生
    checkMQ: function() {
        //WeiQuPai.Util.toast('检查新消息');
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/mq&token=' + user.token,
            method: 'get',
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!rsp) return;
                for (type in rsp) {
                    if (!this.msg[type]) {
                        this.msg[type] = rsp[type];
                    } else {
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
    notify: function(types) {
        if (!Ext.isArray(types)) types = [types];
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (!this.msg[type]) continue;
            this.notifier[type].call(this, this.msg[type]);
        }
    },

    //是否有某种类型的通知, 当有消息时，要主动刷新对应的view
    hasNotify: function(types) {
        if (!Ext.isArray(types)) types = [types];
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (this.msg[type] != null) {
                return true;
            }
        }
        return false;
    },

    clearNotify: function(types) {
        if (!Ext.isArray(types)) types = [types];
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (!this.msg[type]) continue;
            this.clearNotifier[type].call(this);
        }
    },

    //对于每种消息类型对应的处理逻辑，主要是标红点
    notifier: {},
    //清除红点用的消息处理
    clearNotifier: {},

    msgNotify: function(msg) {
        WeiQuPai.sidebar.setBadge('mymessage');
    },

    msgClear: function() {
        WeiQuPai.sidebar.clearBadge('mymessage');
        //清除对应的消息
        this.msg[this.MSG_MESSAGE] = null;
    },

    circleNotify: function(msg) {
        WeiQuPai.sidebar.setBadge('circle');
    },

    circleClear: function() {
        WeiQuPai.sidebar.clearBadge('circle');
        //清除对应的消息
        this.msg[this.MSG_CIRCLE] = null;
    },

    appUpdateNotify: function(msg) {
        WeiQuPai.sidebar.setBadge('setting');
    },

    appUpdateClear: function() {
        WeiQuPai.sidebar.clearBadge('setting');
        //清除对应的消息
        this.msg[this.MSG_APP_UPDATE] = null;
    },

    //新拍券
    newCouponNotify: function() {
        WeiQuPai.sidebar.setBadge('mycoupon');
    },

    newCouponClear: function() {
        WeiQuPai.sidebar.clearBadge('mycoupon');
        //清除对应的消息
        this.msg[this.MSG_NEW_COUPON] = null;
    },

    //新道具
    newPropNotify: function() {
        WeiQuPai.sidebar.setBadge('myprop');
    },

    newPropClear: function() {
        WeiQuPai.sidebar.clearBadge('myprop');
        this.msg[this.MSG_NEW_PROP] = null;
    },

    //新订单
    newOrderNotify: function() {
        WeiQuPai.sidebar.setBadge('myorder');
    },

    newOrderClear: function(id) {
        WeiQuPai.sidebar.clearBadge('myorder');
        this.msg[this.MSG_NEW_ORDER] = null;
    },

    //显示闪屏
    flashNotify: function() {
        WeiQuPai.Util.showSplash();
    },

    //闪屏不需要清除红点
    flashClear: function() {},

    auctionHelpNotify: function() {
        WeiQuPai.sidebar.setBadge('myauction');
    },
    auctionHelpClear: function() {
        WeiQuPai.sidebar.clearBadge('myauction');
        this.msg[this.MSG_USER_AUCTION_HELP] = null;
    },
    auctionFinishNotify: function() {
        WeiQuPai.sidebar.setBadge('myauction');
    },
    auctionFinishClear: function() {
        WeiQuPai.sidebar.clearBadge('myauction');
        this.msg[this.MSG_AUCTION_FINISH] = null;
    },
    auctionReservePriceNotify: function() {
        WeiQuPai.sidebar.setBadge('myauction');
    },
    auctionReservePriceClear: function() {
        WeiQuPai.sidebar.clearBadge('myauction');
        this.msg[this.MSG_AUCTION_RESERVE_PRICE] = null;
    },
});

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
WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_USER_AUCTION_HELP] = WeiQuPai.Notify.auctionHelpNotify;
WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_AUCTION_FINISH] = WeiQuPai.Notify.auctionFinishNotify;
WeiQuPai.Notify.notifier[WeiQuPai.Notify.MSG_AUCTION_RESERVE_PRICE] = WeiQuPai.Notify.auctionReservePriceNotify;

//取消红点的notifier
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
WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_USER_AUCTION_HELP] = WeiQuPai.Notify.auctionHelpClear;
WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_AUCTION_FINISH] = WeiQuPai.Notify.auctionFinishClear;
WeiQuPai.Notify.clearNotifier[WeiQuPai.Notify.MSG_AUCTION_RESERVE_PRICE] = WeiQuPai.Notify.auctionReservePriceClear;