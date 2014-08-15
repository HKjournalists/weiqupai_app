Ext.define('WeiQuPai.controller.CommentList', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            commentView: 'commentlist',
        },
        control: {
            commentView: {
                avatartap: 'doAvatarTap',
                zantap: 'doZan',
                cancelzantap: 'doCancelZan',
                commenttap: 'doCommentTap',
                deletepost: 'doDeletePost',
            }
        }
    },

    doAvatarTap: function(index, record) {
        var uid = record.get('uid');
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(uid);
        WeiQuPai.navigator.push(view);
    },

    doZan: function(index, record) {
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

    doCancelZan: function(index, record) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var id = parseInt(record.get('id'));
        WeiQuPai.Util.delCache('comment_zan', id);
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/cancelZan&token=' + user.token + '&id=' + id;
        WeiQuPai.Util.get(url);
        //异步请求的同时，给数量加1
        record.set('zan_num', parseInt(record.get('zan_num')) - 1);
    },

    //删除回复
    doDeletePost: function(record) {
        var list = self.getCommentView();
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        deleteLayer.setDeleteAction(function() {
            var id = record.get('id');
            var user = WeiQuPai.Cache.get('currentUser');
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/comment/delete&id=' + id + '&token=' + user.token;
            WeiQuPai.Util.get(url, function(rsp) {
                list.getStore().remove(record);
            });
        });
        deleteLayer.show();
    },

    //点回复按钮
    doCommentTap: function(index, record) {
        var view = Ext.create('WeiQuPai.view.Comment');
        view.setCommentId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    doShare: function() {
        this.getPageView().shareLayer.show();
    },

    doRefresh: function() {
        this.getPageView().onDestroy();
        this.getPageView().loadData();
    }

});