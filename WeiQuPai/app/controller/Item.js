Ext.define('WeiQuPai.controller.Item', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            commentForm: 'item inputcomment',
            itemView: 'item',
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
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/comment/post&token=' + user.token,
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike&item_id=' + itemId + '&token=' + user.token;
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemDislike&item_id=' + itemId + '&token=' + user.token;
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike/cancel/&item_id=' + itemId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('item_like', parseInt(itemId));
            view.updateItemStat('like_num', -1);
        });
    },

    doCancelItemDislike: function(view) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = view.getRecord().get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemDislike/cancel&item_id=' + itemId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('item_dislike', parseInt(itemId));
            view.updateItemStat('dislike_num', -1);
        });
    },

});