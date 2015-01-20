Ext.define('WeiQuPai.controller.UserAuction', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'userauction'
        },
        control: {
            pageView: {
                showitem: 'showItem',
                ordertap: 'showOrderView',
                avatartap: 'showUser',
                proptap: 'showPropList',
                sharetap: 'showShareLayer',
                helptap: 'doHelp',
            }
        }
    },

    //显示商品详情
    showItem: function() {
        var data = this.getPageView().getAuctionData();
        WeiQuPai.Util.goItemView(data.item_id);
    },

    //显示用户
    showUser: function(list, index, dataItem, record, e) {
        if (record.get('source') > 1 || record.get('uid') == 0) return;
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(record.get('user').id);
        WeiQuPai.navigator.push(view);
    },

    showShareLayer: function() {
        var data = this.getPageView().getAuctionData();
        var shareData = {
            title: data.status > 1 ? data.share_result_text : data.share_text,
            thumb: WeiQuPai.Util.getImagePath(data.item.pic_cover, 200),
            url: 'http://www.vqupai.com/mm/index.php?r=userAuction&id=' + data.id,
            stat: {
                type: 'user_auction',
                id: data.id,
                item_id: data.item_id
            }
        };
        if (data.status > 1) {
            shareData.url += '&second_share=1';
        }
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        layer.down('button[action=weibo]').setDisabled(true);
        layer.setShareData(shareData);
        layer.show();
    },

    doHelp: function(){
        var data = this.getPageView().getAuctionData();
        var store = this.getPageView().getStore();
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var url = WeiQuPai.Util.apiUrl('r=appv2/userAuction/help&id=' + data.id);
        WeiQuPai.Util.get(url, function(rsp) {
            var propMsg = '';
            if (rsp.prop.indexOf("doubleDiscount") != -1) {
                propMsg += '由于使用了双倍卡，';
            }
            WeiQuPai.Util.toast(propMsg + '您成功帮忙减掉了' + rsp.discount + '元');
            var data = {
                discount: rsp.discount,
                ctime: '刚刚',
                user: {
                    id: user.id,
                    avatar: user.avatar,
                    nick: user.nick,
                } 
            }
            store.insert(0, data);
        });
    },

    showComment: function() {
        var aid = this.getPageView().getAuctionId();
        var view = Ext.create('WeiQuPai.view.UserAuctionComment');
        view.setAuctionId(aid);
        WeiQuPai.navigator.push(view);
    },

    //选择道具
    showPropList: function() {
        var view = Ext.create('WeiQuPai.view.MyProp', {
            selectMode: true
        });
        view.down('dataview').on('itemtap', this.selectProp, this);
        WeiQuPai.navigator.push(view);
    },

    //选择使用道具
    selectProp: function(list, index, dataItem, record, e) {
        var view = this.getPageView();
        var propId = record.get('prop_id');
        var data = view.getAuctionData();
        if (!data.can_use_prop) {
            return WeiQuPai.Util.toast('该商品不能使用道具');
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Util.apiUrl('r=appv2/useProp&prop_id=' + propId + '&auction_id=' + data.id);
        var msg = [, '您的拍卖时间延长了一倍', '您的拍卖在2小时内将获得双倍减价的效果'];
        WeiQuPai.Util.get(url, function(rsp) {
            //数量-1
            record.set('num', parseInt(record.get('num')) - 1);
            //重新加载数据
            view.loadData(function() {
                WeiQuPai.navigator.pop();
                setTimeout(function() {
                    WeiQuPai.Util.toast(msg[propId]);
                }, 300);
            });
        });
    },

    //一拍到底到订单页
    showOrderView: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var auctionData = this.getPageView().getAuctionData();
        if (auctionData.status == WeiQuPai.Config.userAuctionStatus.STATUS_DEAL) {
            WeiQuPai.Util.toast('您的拍卖已成交');
            return;
        }
        if (auctionData.status == WeiQuPai.Config.userAuctionStatus.STATUS_CANCEL) {
            WeiQuPai.Util.toast('由于您长时间未购买，您的拍卖已被系统取消');
            return;
        }
        //这里要重新拉一下最新的价格数据
        var id = auctionData.id;
        var url = WeiQuPai.Util.apiUrl('r=appv2/userAuction/orderInfo&id=' + id);
        WeiQuPai.Util.get(url, function(rsp) {
            function goToOrder() {
                var orderView = Ext.create(rsp.item.type == 1 ? 'WeiQuPai.view.Order' : 'WeiQuPai.view.CouponOrder');
                rsp.auction_type = 2;
                orderView.setAuctionData(rsp);
                setTimeout(function() {
                    WeiQuPai.navigator.push(orderView);
                }, 0);
            }
            //需要验证手机
            if (rsp.need_verify == 1) {
                var view = Ext.create('WeiQuPai.view.VerifyPhone');
                view.setVerifySuccess(function() {
                    goToOrder();
                });
                setTimeout(function() {
                    WeiQuPai.navigator.push(view);
                }, 0);
                return;
            }
            goToOrder();
        }, {
            mask: true
        });
    }
});