Ext.define('WeiQuPai.controller.UserAuctionComment', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'userauctioncomment',
            inputcomment: 'userauctioncomment inputcomment'
        },
        control: {
            pageView: {
                avatartap: 'doAvatarTap',
                commenttap: 'doCommentTap',
                deletemsg: 'showDeleteLayer',
            },
            inputcomment: {
                publish: 'doPublishComment'
            }
        }
    },

    doAvatarTap: function(list, index, record) {
        var uid = record.get('uid');
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(uid);
        WeiQuPai.navigator.push(view);
    },

    doZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var id = parseInt(record.get('id'));
        if (WeiQuPai.Util.hasCache('comment_zan', id)) return;
        WeiQuPai.Util.setCache('comment_zan', id);

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/zan&token=' + user.token + '&id=' + id;
        WeiQuPai.Util.get(url);
        //异步请求的同时，给数量加1
        record.set('zan_num', parseInt(record.get('zan_num')) + 1);
    },

    doCancelZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var id = parseInt(record.get('id'));
        WeiQuPai.Util.delCache('comment_zan', id);
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/cancelZan&token=' + user.token + '&id=' + id;
        WeiQuPai.Util.get(url);
        //异步请求的同时，给数量加1
        record.set('zan_num', parseInt(record.get('zan_num')) - 1);
    },

    //显示删除评论的浮层
    showDeleteLayer: function(list, index, record) {
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        var self = this;
        deleteLayer.setDeleteAction(function() {
            return self.doDeletePost(record);
        });
        deleteLayer.show();
    },

    //删除回复
    doDeletePost: function(record) {
        var id = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var list = this.getPageView();
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/delete&id=' + id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            list.getStore().remove(record);
        });
    },

    //发表拍卖评论
    doPublishComment: function(form) {
        var user = WeiQuPai.Cache.get('currentUser');
        var pageView = this.getPageView();
        var auctionId = pageView.getAuctionId();
        WeiQuPai.Util.mask();
        form.down('hiddenfield[name=auction_id]').setValue(auctionId);
        var data = form.getValues();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/comment/post&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) return false;
                form.reset();
                result.user = {
                    id: user.id,
                    nick: user.nick,
                    avatar: user.avatar
                }
                pageView.msgbox.hide();
                pageView.getStore().add(result);
                setTimeout(function() {
                    var scroller = pageView.getScrollable().getScroller();
                    scroller.scrollToEnd(true);
                }, 200);
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '评论提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },
});