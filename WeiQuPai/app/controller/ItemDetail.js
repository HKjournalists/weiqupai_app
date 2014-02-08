Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            shopInfo : 'disclosureitem[itemId=shopInfo]',
            paiBtn: 'button[action=order]',
            commentBtn: 'button[action=comment]',
            shareBtn: 'button[action=share]',
            commentList: 'itemdetail',
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
                tap: WeiQuPai.Util.showCommentForm
           },
           shareBtn: {
                tap: 'doShare'
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
