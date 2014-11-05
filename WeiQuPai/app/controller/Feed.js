Ext.define('WeiQuPai.controller.Feed', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'feed',
            circleReply: 'circlereplylayer',
        },
        control: {
            pageView: {
                avatartap: 'doAvatarTap',
                feedavatartap: 'doFeedAvatarTap',
                zanavatartap: 'doZanAvatarTap',
                replytap: 'activeReplyForm',
                deletereply: 'showDeleteReply',
                zan: 'doZan',
                cancelzan: 'doCancelZan',
                pictap: 'doPicTap',
                cardtap: 'doCardTap'
            },
            circleReply: {
                publish: 'doPublishReply',
            }
        }
    },

    doFeedAvatarTap: function(view) {
        var uid = view.getFeedRecord().get('uid');
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
        var form = list.down('circlereplylayer');
        form.down('textfield[name=content]').setPlaceHolder(placeHolder);
        form.down('hiddenfield[name=feed_id]').setValue(record.get('id'));
        form.down('hiddenfield[name=to_uid]').setValue(toUid);
        form.down('hiddenfield[name=to_nick]').setValue(toNick);
        form.down('textfield[name=content]').focus();
    },

    //删除动态
    doDeletePost: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var func = function(buttonId) {
            if (buttonId != 'yes') return;
            var feed_id = record.get('id');
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/delete&id=' + feed_id + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                list.getStore().remove(record);
            });
        }
        Ext.Msg.confirm(null, '确实要删除吗？', func, this);

    },


    //发表回复
    doPublishReply: function(form) {
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        var pageView = this.getPageView();
        var fid = pageView.getFeedRecord().get('id');
        WeiQuPai.Util.mask();
        form.down('hiddenfield[name=feed_id]').setValue(fid);
        var data = form.getValues();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/circle/reply&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) return false;
                form.reset();
                form.down('textfield').setPlaceHolder('评论');
                result.user = {
                    id: user.id,
                    nick: user.nick,
                    avatar: user.avatar
                }
                result.to_nick = data.to_nick;
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

    //显示删除回复的浮层
    showDeleteReply: function(list, index, record) {
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        var self = this;
        deleteLayer.setDeleteAction(function() {
            return self.doDeleteReply(record);
        });
        deleteLayer.show();
    },

    //删除回复
    doDeleteReply: function(record) {
        var id = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        var list = this.getPageView();
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/deleteReply&id=' + id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            list.getStore().remove(record);
            list.updateReplyData('reply_num', -1);
        });
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
        var record = view.getFeedRecord();
        var feed_id = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/zan&id=' + feed_id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('circle_zan', feed_id);
            view.updateZanData(1);
        });
    },

    //取消赞
    doCancelZan: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var feed_id = view.getFeedRecord().get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/circle/cancelZan&id=' + feed_id + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('circle_zan', feed_id);
            view.updateZanData(-1);
        });
    },

    //点图片
    doPicTap: function(view, picIdx) {
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setPicData(view.getFeedRecord().get('json_data').pic_list);
        var picIdx = parseInt(picIdx) - 1;
        viewer.setActiveItem(picIdx);
        viewer.show();
    },

    //卡片点击
    doCardTap: function(view) {
        WeiQuPai.Util.goItemView(view.getFeedRecord().get('json_data').item_id);
    }
});