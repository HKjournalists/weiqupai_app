Ext.define('WeiQuPai.controller.MyMessage', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'mymessage'
        },
        control: {
            pageView: {
                viewdetail: 'showDetail',
                deletemsg: 'showDeleteLayer'
            }
        }
    },

    showDetail: function(list, index, record) {
        var type = record.get('pm_type');
        if (type == 1) {
            view = Ext.create('WeiQuPai.view.PrivateMessage');
            view.down('vtitlebar').setTitle(record.get('sender').nick);
            view.setUid(record.get('sender').id);

        } else if (type == 2) {
            view = Ext.create('WeiQuPai.view.Comment');
            view.setCommentId(record.get('content').comment_id);
        } else if (type == 3) {
            view = Ext.create('WeiQuPai.view.Feed');
            view.setFeedId(record.get('content').feed_id);
        } else if (type == 4){
            view = Ext.create('WeiQuPai.view.UserAuctionComment');
            view.setAuctionId(record.get('content').auction_id);
        }
        WeiQuPai.navigator.push(view);
    },

    //显示删除消息的浮层
    showDeleteLayer: function(list, index, record) {
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        var self = this;
        deleteLayer.setDeleteAction(function() {
            return self.doDeleteMessage(record);
        });
        deleteLayer.show();
    },

    //删除消息
    doDeleteMessage: function(record) {
        var id = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        var list = this.getPageView();
        var url = WeiQuPai.Util.apiUrl('r=appv2/message/delete&id=' + id);
        WeiQuPai.Util.get(url, function(rsp) {
            list.getStore().remove(record);
        });
    },

});