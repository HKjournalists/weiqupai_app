Ext.define('WeiQuPai.controller.ShowUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            showuser: 'showuser',      
        },
        control: {
           commentBtn: {
                tap: 'showCommentInput'
           },
           showuser: {
                avatartap: 'doAvatarTap',
                uptap: 'doUpTap',
                commenttap: 'doCommentTap'
           },
        }
    },

    doUpTap: function(index, record){
        console.log(this.config.refs.commentList);
    },

    doCommentTap: function(index, record){
        var tg = {
            xtype: 'circle'
        };
        //this.getMain().push(tg);
        console.log('commenttap');
    }

});
