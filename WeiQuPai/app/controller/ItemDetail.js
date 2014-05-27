Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo : 'disclosureitem[itemId=shopInfo]',
            brandInfo: 'disclosureitem[itemId=brandInfo]',
            paiBtn: 'container[itemId=paiBtn]',
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
           brandInfo: {
                tap: 'showBrand'
           },
           paiBtn: {
                pai: 'showOrderView'
           },
           commentBtn: {
                tap: function(){
                    if(!WeiQuPai.Util.checkLogin()) return false;
                    var auctionId = this.getPageView().auctionData.id;
                    var itemId = this.getPageView().auctionData.item_id;
                    var form = this.getPageView().commentForm;
                    form.down('hiddenfield[name=auction_id]').setValue(auctionId);
                    form.down('hiddenfield[name=item_id]').setValue(itemId);
                    form.show();
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
                publish: 'doPublishComment'
           }, 
           descContainer: {
                toggleDesc: 'toggleDesc'
           }
        }
    },
    
    showShop: function(){
        var shopView = Ext.create('WeiQuPai.view.Shop', {data: this.getPageView().auctionData.shop});
        this.getMain().push(shopView);
    },

    showBrand: function(){
        var brandView = Ext.create('WeiQuPai.view.Brand', {data: this.getPageView().auctionData.brand});
        this.getMain().push(brandView);
    },

    showOrderView: function(){
        var user = WeiQuPai.Util.checkLogin();
        if(!user)return;
        var auctionId = this.getPageView().auctionData.id;
        if(WeiQuPai.Util.hasAuction(auctionId)){
            Ext.Msg.alert(null, '您已经拍过该商品');
            return;
        }
        WeiQuPai.Util.mask();
        var reserve = WeiQuPai.model.Reserve;
        reserve.getProxy().setExtraParam('token', user.token);
        reserve.load(auctionId, {
            success: function(record, operation){
                WeiQuPai.Util.unmask();
                if(!WeiQuPai.Util.invalidToken(record.raw)) return false;
                if(record.get('status') != WeiQuPai.Config.auctionStatus.STATUS_ONLINE){
                    msgArr = ['拍卖还未开始', null, null, '对不起，拍卖已结束'];
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
        var user = WeiQuPai.Cache.get('currentUser');
        var self = this;
        WeiQuPai.Util.mask();
        form.submit({
            url: WeiQuPai.Config.apiUrl + '/?r=app/comment/post&token=' + user.token,
            method: 'post',
            success: function(form, result){
                //评论提交成功后重置表单
                form.reset();
                form.hide();
                WeiQuPai.Util.unmask();
                var list = self.getPageView();
                list.msgbox.hide();
                list.getStore().add(result.commentList);
                list.updateAllListItems();
            },
            failure: function(form, result){
                WeiQuPai.Util.unmask();
                if(!WeiQuPai.Util.invalidToken(result)){
                    form.reset();
                    form.hide();
                    return false;
                }
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
                var config = {height: 130};
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
            method: 'get',
            success: function(rsp){
                rsp = Ext.decode(rsp);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
            }
        });
        //异步请求的同时，给数量加1
        record.set('up_num', parseInt(record.get('up_num')) + 1);
    },

    //点回复按钮
    doCommentTap: function(index, record){
        if(!WeiQuPai.Util.checkLogin()) return;
        var replyId = record.get('id');
        var auctionId = this.getPageView().auctionData.id;
        var itemId  = this.getPageView().auctionData.item_id;
        var form = this.getPageView().commentForm;
        form.down('hiddenfield[name=auction_id]').setValue(auctionId);
        form.down('hiddenfield[name=item_id]').setValue(itemId);
        form.down('hiddenfield[name=reply_id]').setValue(replyId);
        form.show();
    },

    //商品描述的展开和收起
    toggleDesc: function(){
        var desc = this.getDescContainer();
        var data = desc.getData();
        if(!desc.rawContent || desc.rawContent.length <= 30) return;
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
        this.getPageView().shareLayer.show();
    }

});
