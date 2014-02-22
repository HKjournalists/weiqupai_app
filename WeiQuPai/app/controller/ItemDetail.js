Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo : 'disclosureitem[itemId=shopInfo]',
            paiBtn: 'button[action=order]',
            commentBtn: 'button[action=comment]',
            replyBtn: 'button[action=reply]',
            shareBtn: 'button[action=share]',
            pageView: 'itemdetail',
            commentForm: 'commentform',

            descContainer: 'itemdetail container[itemId=itemDesc]'
        },
        control: {
           shopInfo : {
                tap: 'showShop'
           },
           paiBtn: {
                tap: 'showOrderView'
           },
           commentBtn: {
                tap: function(){
                    var auctionId = this.getPageView().getParamId();
                    WeiQuPai.Util.showCommentForm();
                    this.getCommentForm().down('hiddenfield[name=auction_id]').setValue(auctionId);
                }
           },
           replyBtn: {
                reply: function(list, index, record){
                    var auctionId = this.getPageView().getParamId();
                    var replyId = record.get('id');
                    WeiQuPai.Util.showCommentForm();
                    this.getCommentForm().down('hiddenfield[name=auction_id]').setValue(auctionId);
                    this.getCommentForm().down('hiddenfield[name=reply]').setValue(replyId);
                }
           },
           shareBtn: {
                tap: 'doShare'
           },
           pageView: {
                avatartap: 'doAvatarTap',
                uptap: 'doUpTap',
                commenttap: 'doCommentTap'
           },
           commentForm: {
                publishComment: 'doPublishComment'
           }, 
           descContainer: {
                toggleDesc: 'toggleDesc'
           }
        }
    },
    
    showShop: function(){
        var shopView = Ext.create('WeiQuPai.view.Shop');
        this.getMain().push(shopView);
    },

    showOrderView: function(){
        var payView = Ext.create('WeiQuPai.view.Order', {
            paramId : this.getPageView().getParamId()
        });
        this.getMain().push(payView);
    },

    doPublishComment: function(form){
        this.getCommentForm().hide();
        var user = WeiQuPai.Cache.get('currentUser');
        user = {'token' : 123};
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '?r=app/comment/post&token=' + user.token,
            method: 'post',
            success: function(form, result){
                var list = self.getPageView();
                list.setScrollToTopOnRefresh(false);
                list.getStore().load(function(){
                    WeiQuPai.Util.unmask();
                    list.down('#empty_comment') && list.down('#empty_comment').destroy();
                    list.setScrollToTopOnRefresh(true);
                });
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                var msg = result && result.msg || '评论提交失败，请重试';
                Ext.Msg.alert(null, msg);
            }
        });
    },

    doAvatarTap: function(index, record){
        console.log('avatartap');
    },

    doUpTap: function(index, record){
        console.log('uptap');
    },

    doCommentTap: function(index, record){
        console.log('commenttap');
    },

    toggleDesc: function(){
        var desc = this.getDescContainer();
        var data = desc.getData();
        if(desc.toggleState == 'short'){
            desc.toggleState = 'long';
            data.description = desc.rawContent;
            data.button = '<span class="hide-more"></span>';
        }else{
            desc.toggleState = 'short';
            data.description = desc.rawContent.substr(0, 30) + "...";
            data.button = '<span class="show-more"></span>';
        }
        desc.setData(data);
    },

    doShare: function(){
        Ext.Msg.alert(null, '分享!');
    }
});
