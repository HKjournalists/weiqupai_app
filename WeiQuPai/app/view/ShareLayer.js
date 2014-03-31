/**
 *  分享的弹层
 *
 */
Ext.define('WeiQuPai.view.ShareLayer', {
    extend: 'Ext.Container',
    xtype: 'sharelayer',
    config: {
        shareData: null,
        cls: 'share-layer',
        items: [
            {
                xtype: 'container',
                cls: 'share-title',
                html: '<h2>分享到</h2>'
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items:[
                    {
                        xtype:'button',
                        text: '新浪微博',
                        action:'weibo',
                        cls:'w-share-button',
                        iconCls:'weibo',
                        iconAlign:'top',
                        flex:1
                    },
                    {
                        xtype:'button',
                        text:'微信好友',
                        action:'weixin',
                        cls:'w-share-button',
                        iconCls:'weixin',
                        iconAlign:'top',
                        flex:1
                    },
                    {
                        xtype:'button',
                        text:'朋友圈',
                        action:'pyquan',
                        cls:'w-share-button',
                        iconCls:'pyquan',
                        iconAlign:'top',
                        flex:1
                    }
                ]
            },
            {
                xtype: 'button', 
                action: 'cancel',
                text: '取消',
                cls:'w-button-text w-cancel'
            }
        ]
    },

    initialize: function(){
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('button[action=weibo]').on('tap', this.shareWeibo, this);
        this.down('button[action=weixin]').on('tap', this.shareWeixin, this);
        this.down('button[action=pyquan]').on('tap', this.sharePyquan, this);
    },

    applyShareData: function(data){
        return {
            title: data.title + "-" + data.curr_price + '元',
            thumb: WeiQuPai.Config.host + data.pic_cover,
            url: 'http://www.vqupai.com',
            description: '微趣拍'
        };
    },

    shareWeibo: function(){

    },

    shareWeixin: function(){
        this.shareWechat(Wechat.Scene.SESSION);
    },

    sharePyquan: function(){
        this.shareWechat(Wechat.Scene.TIMELINE);
    },

    shareWechat: function(scene){
        var me = this;
        var msg = this.getShareData();
        var data = {
            message: {
                title: msg.title,
                thumb: msg.thumb,
                description: msg.description,
                media: {
                    webpageUrl: msg.url
                }
            },
            scene: scene
        }
        Wechat.share(data, function () {
            //成功后关掉分享弹层
            me.hide();
        }, function (reason) {
            //Ext.Msg.alert(null, "分享失败: " + reason);
        });
    },
});
