Ext.define('WeiQuPai.controller.Circle', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'circle',
            circleReply: 'circlereplylayer',
            circlePost: 'circlepost',
        },
        control: {
            pageView: {
                avatartap: 'doAvatarTap',
                usertap: 'onUserTap',
                replytap: 'showReplyForm',
                deletereply: 'showDeleteReply',
                deletepost: 'doDeletePost',
                zan: 'doZan',
                cancelzan: 'doCancelZan',
                cardtap: 'doCardTap',
            },
            circleReply: {
                publish: 'doPublishReply',
            },
            circlePost: {
                publish: 'doPublishPost',
            },
            publishBtn: {
                tap: 'showPublishForm'
            }
        }
    },

    doAvatarTap: function(list, index, record) {
        var uid = record.get('uid');
        var showUser = Ext.create('WeiQuPai.view.ShowUser');
        showUser.setUid(uid);
        WeiQuPai.navigator.push(showUser);
    },

    //显示回复的表单
    showReplyForm: function(list, index, record, toUid, toNick) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        toUid = toUid || 0;
        var placeHolder = toNick ? '回复' + toNick : '评论';
        var form = WeiQuPai.Util.createOverlay('WeiQuPai.view.CircleReplyLayer', {
            height: 48,
            showAnimation: false,
            hideAnimation: false
        });
        form.down('textfield[name=content]').setPlaceHolder(placeHolder);
        form.down('hiddenfield[name=feed_id]').setValue(record.get('id'));
        form.down('hiddenfield[name=to_uid]').setValue(toUid);
        form.down('hiddenfield[name=to_nick]').setValue(toNick);
        form.show();
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
        form.hide();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        var data = form.getValues();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/reply&token=' + user.token,
            method: 'post',
            success: function(form, result) {
                WeiQuPai.Util.unmask();
                if (!WeiQuPai.Util.invalidToken(result)) return false;
                form.reset();
                data.id = result.id;
                data.uid = user.id;
                data.nick = user.nick;
                data.to_uid = data.to_uid;
                data.to_nick = data.to_nick;
                var list = self.getPageView();
                var record = list.getStore().getById(data.feed_id);
                var replies = record.get('replies') || [];
                replies.push(data);
                record.set('replies', replies);
                //刷新view
                list.updateAllListItems();
            },
            failure: function(form, result) {
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '回复提交失败，请重试';
                WeiQuPai.Util.toast(msg);
            }
        });
    },

    //显示删除回复的浮层
    showDeleteReply: function(list, index, record, id) {
        if (!this.deleteLayer) {
            var config = {
                height: 120
            };
            this.deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer', config);
        }
        var self = this;
        this.deleteLayer.setDeleteAction(function() {
            return self.doDeleteReply(record, id);
        });
        this.deleteLayer.show();
    },

    //删除回复
    doDeleteReply: function(record, id) {
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        this.deleteLayer.hide();
        WeiQuPai.Util.mask();
        var list = this.getPageView();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/deleteReply&token=' + user.token,
            method: 'get',
            params: {
                'id': id
            },
            success: function(rsp) {
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                var replies = record.get('replies');
                for (var i = 0; i < replies.length; i++) {
                    if (replies[i].id == id) {
                        replies.splice(i, 1);
                    }
                }
                record.set('replies', replies);
                list.updateAllListItems();
            }
        });
    },

    //赞
    doZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var feed_id = record.get('id');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/zan&token=' + user.token,
            method: 'get',
            params: {
                id: feed_id
            },
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                var zan = record.get('zan') || [];
                zan.push({
                    'id': rsp.id,
                    'uid': user.id,
                    'nick': user.nick
                });
                record.set('zan', zan);
                list.updateAllListItems();
            }
        });
    },

    //取消赞
    doCancelZan: function(list, index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/cancelZan&token=' + user.token,
            method: 'get',
            params: {
                'id': record.get('id')
            },
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                var zan = record.get('zan');
                for (var i = 0; i < zan.length; i++) {
                    if (zan[i].uid == user.id) {
                        zan.splice(i, 1);
                    }
                }
                if (zan.length == 0) zan = null;
                record.set('zan', zan);
                list.updateAllListItems();
            }
        });
    },

    //卡片点击
    doCardTap: function(list, index, record, dataType) {
        var cardHandler = this['card_' + dataType];
        cardHandler && cardHandler.call(this, record);
    },

    //进入商品详情
    card_item: function(record) {
        //处理多次点击的问题
        var main = Ext.Viewport.down('main');
        if (main.isAnimating) return;
        var param = {
            id: record.get('json_data').id
        };
        var view = Ext.create('WeiQuPai.view.ItemDetail');
        view.setParam(param);
        main.push(view);
    }
});