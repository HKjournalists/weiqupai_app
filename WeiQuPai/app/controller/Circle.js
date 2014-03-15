Ext.define('WeiQuPai.controller.Circle', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView : 'circle',
            main : 'main',
            circleReply: 'circlereply',
            circlePost: 'circlepost',
            publishBtn: 'circle button[action=publishPost]'
        },
        control: {
            pageView : {
                avatartap: function(list, index, record){
                    var uid = record.get('uid');
                    if(!WeiQuPai.Util.isLogin()) return;
                    if(WeiQuPai.Util.isFriend(uid)){
                        this.showUser(list, index, record, 0);
                    }else{
                        this.showAddFriendLayer(list, index, record, record.get('uid'));
                    }
                },
                usertap: 'showAddFriendLayer',
                replytap: 'showReplyForm',
                deletereply: 'showDeleteReply',
                deletepost: 'doDeletePost',
                zan: 'doZan',
                cancelzan: 'doCancelZan'
            },
            circleReply: {
                publish: 'doPublishReply',
            },
            circlePost: {
                publish: 'doPublishPost',
            },
            publishBtn: {
                tap : 'showPublishForm'
            }
        }
    },
    
    showAddFriendLayer: function(list, index, record, uid){
        if(!this.addFriendLayer){
            var config = {height: 120};
            this.addFriendLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.AddFriendButtonLayer', config);
        }
        this.addFriendLayer.setUid(uid);
        this.addFriendLayer.show();
    },

    showUser: function(list, index, record, uid) {
        uid = uid || record.get('uid');
        WeiQuPai.Util.forward('showuser', {param: uid})
    },

    //显示回复的表单
    showReplyForm: function(list, index, record, toUid, toNick){
        toUid = toUid || 0;
        var placeHolder = toNick ? '回复' + toNick : '评论';
        var form = WeiQuPai.Util.showCircleReply();
        form.down('hiddenfield[name=feed_id]').setValue(record.get('id'));
        form.down('hiddenfield[name=to_uid]').setValue(toUid);
        form.down('textareafield').setPlaceHolder(placeHolder);
    },

    //显示发表动态的表单
    showPublishForm: function(){
        WeiQuPai.Util.showCirclePost();
    },

    //删除动态
    doDeletePost: function(list, index, record){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user) return;
        var func = function(buttonId){
            if(buttonId != 'yes') return;
            var feed_id = record.get('id');
            Ext.Ajax.request({
                url: WeiQuPai.Config.apiUrl + '/?r=app/circle/delete&token=' + user.token,
                method: 'get',
                params: {'id': feed_id},
                success: function(rsp){
                    rsp = Ext.decode(rsp.responseText);
                    if(rsp.code > 0){
                        Ext.Msg.alert(null, rsp.msg);
                        return;
                    }
                    list.getStore().remove(record);
                }
            });
        }
        Ext.Msg.confirm(null, '确实要删除吗？', func, this);
        
    },

    //发表动态
    doPublishPost: function(form){
        form.hide();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        var data = form.getValues();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/post&token=' + user.token,
            method: 'post',
            success: function(form, result){
                WeiQuPai.Util.unmask();
                form.reset();
                data = Ext.merge(data, result);
                data.uid = user.id;
                data.nick = user.nick;
                var record = Ext.create('WeiQuPai.model.Circle', data);
                var list = self.getPageView();
                list.getStore().insert(0, record);
                list.getScrollable().getScroller().scrollToTop();
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '数据提交失败，请重试';
                Ext.Msg.alert(null, msg);
            }
        });
    },

    //发表回复
    doPublishReply: function(form){
        form.hide();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        var data = form.getValues();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/reply&token=' + user.token,
            method: 'post',
            success: function(form, result){
                WeiQuPai.Util.unmask();
                form.reset();
                data.id = result.id;
                data.uid = user.id;
                data.nick = user.nick;
                var list = self.getPageView();
                var record = list.getStore().getById(data.feed_id);
                var replies = record.get('replies') || [];
                replies.push(data);
                record.set('replies', replies);
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '回复提交失败，请重试';
                Ext.Msg.alert(null, msg);
            }
        });
    },

    //显示删除回复的浮层
    showDeleteReply: function(list, index, record, id){
        if(!this.deleteLayer){
            var config = {height: 120};
            this.deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer', config);
        }
        var self = this;
        this.deleteLayer.setDeleteAction(function(){
            return self.doDeleteReply(record, id);
        });
        this.deleteLayer.show();
    },

    //删除回复
    doDeleteReply: function(record, id){
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        this.deleteLayer.hide();
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/deleteReply&token=' + user.token,
            method: 'get',
            params: {'id': id},
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                var replies = record.get('replies');
                for(var i=0; i<replies.length; i++){
                    if(replies[i].id == id){
                        replies.splice(i, 1);
                    }
                }
                record.set('replies', replies);
            }
        });
    },

    //赞
    doZan: function(list, index, record){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user) return;
        var feed_id = record.get('id');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/zan&token=' + user.token,
            method: 'get',
            params: {id: feed_id},
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                var zan = record.get('zan') || [];
                zan.push({'id': rsp.id, 'uid': user.id, 'nick': user.nick});
                record.set('zan', zan);
            }
        });
    },

    //取消赞
    doCancelZan: function(list, index, record){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user) return;
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle/cancelZan&token=' + user.token,
            method: 'get',
            params: {'id': record.get('id')},
            success: function(rsp){
                rsp = Ext.decode(rsp.responseText);
                if(rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                var zan = record.get('zan');
                for(var i=0; i<zan.length; i++){
                    if(zan[i].uid == user.id){
                        zan.splice(i, 1);
                    }
                }
                if(zan.length == 0) zan = null;
                record.set('zan', zan);
            }
        });
    }
});
