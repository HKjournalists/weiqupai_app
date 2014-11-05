Ext.define('WeiQuPai.controller.Comment', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'comment',
            reply: 'inputcomment[itemId=reply]',
        },
        control: {
            pageView: {
                avatartap: 'doAvatarTap',
                feedavatartap: 'doFeedAvatarTap',
                zanavatartap: 'doZanAvatarTap',
                //replytap: 'activeReplyForm',
                deletereply: 'doDeleteReply',
                zan: 'doZan',
                cancelzan: 'doCancelZan',
                pictap: 'doPicTap',
                cardtap: 'doCardTap'
            },
            reply: {
                publish: 'doPublishReply',
            }
        }
    },

    doFeedAvatarTap: function(view) {
        var uid = view.getCommentRecord().get('uid');
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },

    doZanAvatarTap: function(view, uid) {
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },

    doAvatarTap: function(list, index, record) {
        var uid = record.get('uid');
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },

    //显示回复的表单
    activeReplyForm: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var toNick = record.get('user').nick;
        var toUid = record.get('uid');
        var placeHolder = '回复' + toNick;
        var form = list.down('inputcomment');
        form.down('textfield[name=content]').setPlaceHolder(placeHolder);
        form.down('hiddenfield[name=feed_id]').setValue(record.get('id'));
        form.down('hiddenfield[name=to_uid]').setValue(toUid);
        form.down('hiddenfield[name=to_nick]').setValue(toNick);
        form.down('textfield[name=content]').focus();
    },

    //发表回复
    doPublishReply: function(form) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var pageView = this.getPageView();
        var item = pageView.getCommentRecord().get('item');
        var cid = pageView.getCommentRecord().get('id');
        WeiQuPai.Util.mask();
        form.down('hiddenfield[name=item_id]').setValue(item.id);
        form.down('hiddenfield[name=reply_id]').setValue(cid);
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
                pageView.getStore().add(result);
                pageView.updateReplyData('reply_num', 1);
                result.score && WeiQuPai.Util.toast('评论成功，获得' + result.score + '积分');

                setTimeout(function() {
                    var scroller = pageView.getScrollable().getScroller();
                    scroller.scrollToEnd(true);
                }, 200);
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '回复提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },

    //删除回复
    doDeleteReply: function(record) {
        var list = this.getPageView();
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        deleteLayer.setDeleteAction(function() {
            var id = record.get('id');
            var user = WeiQuPai.Cache.get('currentUser');
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/delete&id=' + id + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                list.getStore().remove(record);
                list.updateReplyData('reply_num', -1);
            });
        });
        deleteLayer.show();
    },

    //点回复的头像
    doAvatarTap: function(list, index, record) {
        var uid = record.get('uid');
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },

    //赞
    doZan: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var record = view.getCommentRecord();
        var cid = parseInt(record.get('id'));
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/zan&id=' + cid + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('comment_zan', cid);
            view.updateZanData(1);
        });
    },

    //取消赞
    doCancelZan: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var cid = parseInt(view.getCommentRecord().get('id'));
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/cancelZan&id=' + cid + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('comment_zan', cid);
            view.updateZanData(-1);
        });
    },

    //卡片点击
    doCardTap: function(view) {
        WeiQuPai.Util.goItemView(view.getCommentRecord().get('item').id);
    }
});