Ext.define('WeiQuPai.controller.Auction', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            shopInfo: 'disclosureitem[itemId=shopInfo]',
            brandInfo: 'disclosureitem[itemId=brandInfo]',
            commentBtn: 'button[action=comment]',
            shareBtn: 'button[action=share]',
            paiBtn: 'auction button[action=pai]',
            commentForm: 'inputcomment[itemId=postComment]',
            refreshBtn: 'button[action=refresh]'
        },
        control: {
            shopInfo: {
                tap: 'showShop'
            },
            brandInfo: {
                tap: 'showBrand'
            },
            paiBtn: {
                tap: 'showOrderView'
            },
            commentBtn: {
                tap: 'showCommentLayer'
            },
            shareBtn: {
                tap: 'doShare'
            },
            refreshBtn: {
                tap: 'doRefresh'
            },
            commentForm: {
                publish: 'doPublishComment'
            }
        }
    },

    showCommentLayer: function() {
        if (!WeiQuPai.Util.checkLogin()) return false;
        var currentView = WeiQuPai.navigator.getActiveItem();
        var itemId = currentView.getRecord().get('id');
        var form = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment');
        form.setItemId('postComment');
        form.down('hiddenfield[name=item_id]').setValue(itemId);
        form.show();
        form.down('textfield[name=content]').focus();
    },
    //商家
    showShop: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        var data = currentView.getRecord().data;
        if (data.shop.description || data.shop.pic_url) {
            var shopView = Ext.create('WeiQuPai.view.Shop', {
                data: data.shop
            });
            WeiQuPai.navigator.push(shopView);
        } else {
            window.open(data.shop.site, '_system');
        }
    },

    showBrand: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        var brandView = Ext.create('WeiQuPai.view.Brand', {
            data: currentView.getRecord().get('brand')
        });
        WeiQuPai.navigator.push(brandView);
    },

    //普通拍卖到订单页
    showOrderView: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var currentView = WeiQuPai.navigator.getActiveItem();
        var auctionId = currentView.getRecord().get('auction').id;
        if (WeiQuPai.Util.hasAuction(auctionId)) {
            WeiQuPai.Util.toast('您已经拍过该商品');
            return;
        }
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/reserve&id=' + auctionId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            if (rsp.status != WeiQuPai.Config.auctionStatus.STATUS_ONLINE) {
                msgArr = ['拍卖还未开始', null, null, '对不起，拍卖已结束'];
                msg = msgArr[rsp.status];
                WeiQuPai.Util.toast(msg);
                return;
            }
            var orderView = Ext.create('WeiQuPai.view.Order');
            rsp.auction_type = 1;
            orderView.setAuctionData(rsp);
            WeiQuPai.navigator.push(orderView);
        }, {
            mask: true
        });
    },

    doPublishComment: function(form) {
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/comment/post&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                var data = form.getValues();
                //评论提交成功后重置表单
                form.reset();
                form.hide();
                var list = WeiQuPai.navigator.getActiveItem().down('commentlist');
                list.msgbox.hide();
                result.user = {
                    id: user.id,
                    avatar: user.avatar,
                    nick: user.nick
                }
                list.getStore().insert(0, result);
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

    doShare: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        currentView.shareLayer.show();
    },

    doRefresh: function() {
        var currentView = WeiQuPai.navigator.getActiveItem();
        currentView.onDestroy();
        currentView.loadData();
    }

});