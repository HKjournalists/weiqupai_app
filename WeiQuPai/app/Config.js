Ext.define("WeiQuPai.Config", {
    singleton: true,
    //保存基础url
    host: 'http://localhost',
    apiUrl: 'http://localhost',
    updateUrl: 'http://localhost/update',
    //app版本
    version: "2.0",

    //订单状态
    orderStatusText: ['未付款', '处理中', '已发货', '已完成', '取消未付款', '取消已付款'],
    orderStatus: {
        STATUS_TOPAY: 0,
        STATUS_TODEAL: 1,
        STATUS_SHIPMENT: 2,
        STATUS_FINISH: 3,
        STATUS_CANCEL_NOPAY: 4,
        STATUS_CANCEL_PAID: 5
    },
    auctionStatus: {
        STATUS_NOT_START: 0,
        STATUS_SETTLE: 1,
        STATUS_ONLINE: 2,
        STATUS_FINISH: 3
    },
    userAuctionStatus: {
        STATUS_ONLINE: 1,
        STATUS_FINISH: 2,
        STATUS_DEAL: 3,
        STATUS_CANCEL: 4
    },
    market: 'appstore'
})