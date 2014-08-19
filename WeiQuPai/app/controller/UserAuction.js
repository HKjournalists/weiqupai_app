Ext.define('WeiQuPai.controller.UserAuction', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'userauction',
            paiBtn: 'userauction button[action=pai]',
            shareBtn: 'userauction button[action=share]',
            commentBtn: 'userauction button[action=comment]'
        },
        control: {
            paiBtn: {
                tap: 'showOrderView'
            },
            shareBtn: {
                tap: 'showShareLayer'
            },
            commentBtn: {
                tap: 'showComment'
            },
            pageView: {
                itemdetail: 'showItem',
                avatartap: 'showUser',
                proptap: 'showPropList'
            }
        }
    },

    //显示商品详情
    showItem: function() {
        var data = this.getPageView().getAuctionData();
        WeiQuPai.Util.goItemView(data.item_id, true);
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
            title: data.item.title,
            thumb: WeiQuPai.Util.getImagePath(data.item.pic_cover, 200),
            url: 'http://www.vqupai.com/mm/index.php?r=userAuction&id=' + data.id
        }
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        layer.down('button[action=weibo]').setDisabled(true);
        layer.setShareData(shareData);
        layer.show();
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
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/useProp&prop_id=' + propId + '&auction_id=' + data.id + '&token=' + user.token;
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/view&basic=1&id=' + id;
        WeiQuPai.Util.get(url, function(rsp) {
            rsp.auction_type = 2;
            var view = Ext.create('WeiQuPai.view.Order');
            view.setAuctionData(rsp);
            setTimeout(function() {
                WeiQuPai.navigator.push(view);
            }, 0);
        });
    }
});