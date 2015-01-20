Ext.define('WeiQuPai.controller.Item', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            commentForm: 'inputcomment[itemId=itemCommentForm]',
            itemView: 'item',
            auctionView: 'auctionv2'
        },
        control: {
            commentForm: {
                publish: 'doPublishComment'
            },
            itemView: {
                itemlike: 'doItemLike',
                itemdislike: 'doItemDislike',
                cancelitemlike: 'doCancelItemLike',
                cancelitemdislike: 'doCancelItemDislike'
            },
            auctionView: {
                itemlike: 'doItemLike',
                itemdislike: 'doItemDislike',
                cancelitemlike: 'doCancelItemLike',
                cancelitemdislike: 'doCancelItemDislike',
                buy: 'showOrderView'
            }
        }
    },

    doPublishComment: function(form) {
        if(form.down('textfield[name=content]').getValue().trim().length == 0){
            return;
        }
        var user = WeiQuPai.Util.checkLogin();
        if(!user){
            return;
        }
        var view = WeiQuPai.navigator.getActiveItem();
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Util.apiUrl('r=appv2/comment/post'),
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                var data = form.getValues();
                //评论提交成功后重置表单
                form.down('textfield[name=content]').reset();
                var list = WeiQuPai.navigator.getActiveItem().down('commentlist');
                list.msgbox.hide();
                result.user = {
                    id: user.id,
                    avatar: user.avatar,
                    nick: user.nick
                }
                list.getStore().insert(0, result);
                view.updateItemStat('comment_num', 1);
                result.score && WeiQuPai.Util.toast('评论成功，获得' + result.score + '积分');
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) {
                    form.reset();
                    form.hide();
                    return false;
                }
                var msg = result && result.msg || '评论提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },

    doItemLike: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = view.getRecord().get('id');
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemLike&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('item_like', parseInt(itemId));
            view.updateItemStat('like_num', 1);
            WeiQuPai.Util.heartBeat(view.down('#item_title').element.down('.selflike'));
        });
    },

    doItemDislike: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = view.getRecord().get('id');
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemDislike&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('item_dislike', parseInt(itemId));
            view.updateItemStat('dislike_num', 1);
            WeiQuPai.Util.heartBeat(view.down('#item_title').element.down('.selfnolike'));

        });
    },

    doCancelItemLike: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = view.getRecord().get('id');
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemLike/cancel&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('item_like', parseInt(itemId));
            view.updateItemStat('like_num', -1);
        });
    },

    doCancelItemDislike: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = view.getRecord().get('id');
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemDislike/cancel&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('item_dislike', parseInt(itemId));
            view.updateItemStat('dislike_num', -1);
        });
    },

    //普通拍卖到订单页
    showOrderView: function(auctionId) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var currentView = WeiQuPai.navigator.getActiveItem();
        var auctionId = Ext.isObject(auctionId) ? currentView.getRecord().get('auction').id : auctionId;
        var url = WeiQuPai.Util.apiUrl('r=appv2/reserve&id=' + auctionId);
        WeiQuPai.Util.get(url, function(rsp) {
            function goToOrder(){
                var orderView = Ext.create('WeiQuPai.view.Order');
                rsp.auction_type = 1;
                orderView.setAuctionData(rsp);
                setTimeout(function() {
                    WeiQuPai.navigator.push(orderView);
                }, 0);
            }
            if (rsp.status != WeiQuPai.Config.auctionStatus.STATUS_ONLINE) {
                msgArr = ['拍卖还未开始', null, null, '对不起，拍卖已结束'];
                msg = msgArr[rsp.status];
                WeiQuPai.Util.toast(msg);
                return;
            }
            //需要验证手机
            if(rsp.need_verify == 1){
                var view = Ext.create('WeiQuPai.view.VerifyPhone');
                view.setVerifySuccess(goToOrder);
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