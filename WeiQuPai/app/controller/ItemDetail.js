Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo: 'disclosureitem[itemId=shopInfo]',
            brandInfo: 'disclosureitem[itemId=brandInfo]',
            paiBtn: 'container[itemId=paiBtn]',
            commentBtn: 'button[action=comment]',
            shareBtn: 'button[action=share]',
            paiBtn: 'button[action=pai]',
            pageView: 'itemdetail',
            commentForm: 'commentform',
            commentView: 'comment',
            descContainer: 'itemdetail container[itemId=itemDesc]'
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
                tap: function() {
                    if (!WeiQuPai.Util.checkLogin()) return false;
                    var itemId = this.getPageView().auctionData.item_id;
                    var form = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', {
                        height: 48,
                        showAnimation: false,
                        hideAnimation: false
                    });
                    form.down('hiddenfield[name=item_id]').setValue(itemId);
                    form.show();
                }
            },
            shareBtn: {
                tap: 'doShare'
            },
            pageView: {
                refresh: 'doRefresh'
            },
            commentView: {
                avatartap: 'doAvatarTap',
                uptap: 'doUpTap',
                commenttap: 'doCommentTap'
            },
            commentForm: {
                publish: 'doPublishComment'
            },
            descContainer: {
                toggleDesc: 'toggleDesc'
            }
        }
    },

    //商家
    showShop: function() {
        var data = this.getPageView().auctionData;
        if (data.shop.description || data.shop.pic_url) {
            var shopView = Ext.create('WeiQuPai.view.Shop', {
                data: this.getPageView().auctionData.shop
            });
            this.getMain().push(shopView);
        } else {
            window.open(data.shop.site, '_system');
        }
    },

    showBrand: function() {
        var brandView = Ext.create('WeiQuPai.view.Brand', {
            data: this.getPageView().auctionData.brand
        });
        this.getMain().push(brandView);
    },

    showOrderView: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var auctionId = this.getPageView().auctionData.id;
        if (WeiQuPai.Util.hasAuction(auctionId)) {
            WeiQuPai.Util.toast('您已经拍过该商品');
            return;
        }
        WeiQuPai.Util.mask();
        var reserve = WeiQuPai.model.Reserve;
        reserve.getProxy().setExtraParam('token', user.token);
        reserve.load(auctionId, {
            success: function(record, operation) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(record.raw)) return false;
                if (record.get('status') != WeiQuPai.Config.auctionStatus.STATUS_ONLINE) {
                    msgArr = ['拍卖还未开始', null, null, '对不起，拍卖已结束'];
                    msg = msgArr[record.get('status')];
                    WeiQuPai.Util.toast(msg);
                    return;
                }
                var orderView = Ext.create('WeiQuPai.view.Order');
                orderView.setAuctionData(record.data);
                this.getMain().push(orderView);
            },
            failure: function() {
                WeiQuPai.Util.unmask();
                WeiQuPai.Util.toast('数据加载失败');
            }
        }, this);
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
                var list = self.getCommentView();
                list.msgbox.hide();
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

    doAvatarTap: function(index, record) {
        var uid = record.get('uid');
        WeiQuPai.Util.forward('showuser', {
            param: uid
        });
    },

    doUpTap: function(index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var id = parseInt(record.get('id'));
        //赞过的不允许再赞
        if (WeiQuPai.Util.hasCache('comment_up', id)) return;
        WeiQuPai.Util.setCache('comment_up', id);

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/up&token=' + user.token + '&id=' + id;
        WeiQuPai.Util.get(url);
        //异步请求的同时，给数量加1
        record.set('up_num', parseInt(record.get('up_num')) + 1);
    },

    //点回复按钮
    doCommentTap: function(index, record) {
        if (!WeiQuPai.Util.checkLogin()) return;
        var replyId = record.get('id');
        var itemId = this.getPageView().auctionData.item_id;
        var form = WeiQuPai.Util.createOverlay('WeiQuPai.view.InputComment', {
            height: 48,
            showAnimation: false,
            hideAnimation: false
        });
        form.down('hiddenfield[name=item_id]').setValue(itemId);
        form.down('hiddenfield[name=reply_id]').setValue(replyId);
        form.show();
    },

    doShare: function() {
        this.getPageView().shareLayer.show();
    },

    doRefresh: function() {
        this.getPageView().onDestroy();
        this.getPageView().setParam(this.getPageView().getParam());
    }

});