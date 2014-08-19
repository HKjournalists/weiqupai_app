Ext.define('WeiQuPai.controller.Circle', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'circle'
        },
        control: {
            pageView: {
                avatartap: 'doAvatarTap',
                deletepost: 'doDeletePost',
                zan: 'doZan',
                cancelzan: 'doCancelZan',
                cardtap: 'doCardTap',
                feedtap: 'doFeedTap',
                pictap: 'doPicTap',
                helptap: 'doHelpTap',
                showtap: 'doShowTap',
                killtap: 'doKillTap'
            }
        }
    },

    doAvatarTap: function(list, index, record) {
        var uid = record.get('uid');
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },


    //删除动态
    doDeletePost: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        var list = this.getPageView();
        deleteLayer.setDeleteAction(function() {
            var feed_id = record.get('id');
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/delete&id=' + feed_id + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                list.getStore().remove(record);
            });
        });
        deleteLayer.show();
    },

    //赞
    doZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var feed_id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/zan&id=' + feed_id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            var zan = parseInt(record.get('zan_num'));
            WeiQuPai.Util.setCache('circle_zan', feed_id);
            record.set('zan_num', zan + 1);
            var el = Ext.get(list.getViewItems()[index]).down('.selflike');
            WeiQuPai.Util.heartBeat(el);
        });
    },

    //取消赞
    doCancelZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var feed_id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/cancelZan&id=' + feed_id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            var zan = parseInt(record.get('zan_num'));
            WeiQuPai.Util.delCache('circle_zan', feed_id);
            record.set('zan_num', zan - 1);
        });
    },

    //卡片点击
    doCardTap: function(list, index, record, dataType) {
        WeiQuPai.Util.goItemView(record.get('json_data').item_id);
    },

    //整条记录点击，进入详情页
    doFeedTap: function(list, index, record) {
        var feedView = Ext.create('WeiQuPai.view.Feed');
        feedView.setFeedId(record.get('id'));
        WeiQuPai.navigator.push(feedView);
    },

    //帮拍点击
    doHelpTap: function(list, index, record) {
        var auctionId = record.get('json_data').auction_id;
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/help&id=' + auctionId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('您成功帮忙减掉了' + rsp.discount + '元');
        });
    },

    //观战点击
    doShowTap: function(list, index, record) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(record.get('json_data').auction_id);
        WeiQuPai.navigator.push(view);
    },

    //血战到底点击
    doKillTap: function(list, index, record) {
        var view = Ext.create('WeiQuPai.view.KillEnd');
        WeiQuPai.navigator.push(view);
    },

    //点图片
    doPicTap: function(list, index, record, picIdx) {
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setPicData(record.get('json_data').pic_list);
        var picIdx = parseInt(picIdx) - 1;
        viewer.setActiveItem(picIdx);
        viewer.show();
    }

});