Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo : 'disclosureitem[itemId=shopInfo]',
            paiBtn: 'button[action=order]',
            commentBtn: 'button[action=comment]',
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
                    if(!WeiQuPai.Util.checkLogin()) return false;
                    var auctionId = this.getPageView().auctionData.id;
                    var itemId = this.getPageView().getParam().item_id;
                    var form = WeiQuPai.Util.showCommentForm();
                    form.down('hiddenfield[name=auction_id]').setValue(auctionId);
                    form.down('hiddenfield[name=item_id]').setValue(itemId);
                    form.down('button[action=publishComment]').setText('发表评论');
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
        if(!WeiQuPai.Util.checkLogin()) return;
        WeiQuPai.Util.mask();
        var auction = WeiQuPai.model.Auction;
        auction.load(this.getPageView().auctionData.id, {
            success: function(record, operation, success){
                WeiQuPai.Util.unmask();
                if(record.get('status') != 2){
                    msgArr = ['拍卖还未开始', '拍卖正在结算中，请稍等几分钟', null, '对不起，拍卖已结束'];
                    msg = msgArr[record.get('status')];
                    Ext.Msg.alert(null, msg);
                    return;
                }
                var orderView = Ext.create('WeiQuPai.view.Order');
                orderView.setAuctionData(record.data);
                this.getMain().push(orderView);
            },
            failure: function(){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '数据加载失败');    
            }
        }, this);
    },

    doPublishComment: function(form){
        this.getCommentForm().hide();
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/comment/post&token=' + user.token,
            method: 'post',
            success: function(form, result){
                //评论提交成功后重置表单
                form.reset();
                var list = self.getPageView();
                list.setScrollToTopOnRefresh(false);
                list.getStore().load(function(){
                    WeiQuPai.Util.unmask();
                    list.down('#msgbox') && list.down('#msgbox').destroy();
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
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        var uid = record.get('uid');
        if(user.id == uid || WeiQuPai.Util.isFriend(uid)){
            WeiQuPai.Util.forward('showuser', {param: uid});
        }else{
            if(!this.addFriendLayer){
                var config = {height: 120};
                this.addFriendLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.AddFriendButtonLayer', config);
            }
            this.addFriendLayer.setUid(uid);
            this.addFriendLayer.show();
        }
    },

    doUpTap: function(index, record){
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        var id = record.get('id');
        //赞过的不允许再赞
        if(!WeiQuPai.Util.cacheUp(id)) return;

        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/comment/up&token=' + user.token + '&id=' + id,
            method: 'get'
        });
        //异步请求的同时，给数量加1
        record.set('up_num', parseInt(record.get('up_num')) + 1);
    },

    //点回复按钮
    doCommentTap: function(index, record){
        if(!WeiQuPai.Util.checkLogin()) return;
        var replyId = record.get('id');
        var auctionId = this.getPageView().getData().id;
        var itemId  = this.getPageView().getData().item_id;
        var form = WeiQuPai.Util.showCommentForm();
        form.down('hiddenfield[name=auction_id]').setValue(auctionId);
        form.down('hiddenfield[name=item_id]').setValue(itemId);
        form.down('hiddenfield[name=reply_id]').setValue(replyId);
        form.down('button[action=publishComment]').setText('回复');
    },

    //商品描述的展开和收起
    toggleDesc: function(){
        var desc = this.getDescContainer();
        var data = desc.getData();
        if(desc.rawContent.length <= 30) return;
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
