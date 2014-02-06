Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo : 'disclosureitem[itemId=shopInfo]',
            pai: 'button[action=order]',
            commentBtn: 'button[action=comment]',
            commentList: 'itemdetail',
            commentForm: 'commentform',
            descContainer: 'itemdetail container[itemId=itemDesc]'
        },
        control: {
           shopInfo : {
                tap: 'showShop'
           },
           pai: {
                tap: 'showOrderView'
           },
           commentBtn: {
                tap: WeiQuPai.Util.showCommentForm
           },
           commentList: {
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
        var payView = {
            xtype: 'order'
        }
        this.getMain().push(payView);
    },

    doPublishComment: function(form){
        Ext.Msg.alert(form.getValues().comment);
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
            data.button = '<span class="hide-more">收起</span>';
        }else{
            desc.toggleState = 'short';
            data.description = desc.rawContent.substr(0, 30) + "...";
            data.button = '<span class="show-more">展开</span>';
        }
        desc.setData(data);
    }
});
