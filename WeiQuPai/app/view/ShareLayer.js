/**
 *  分享的弹层
 *
 */
Ext.define('WeiQuPai.view.ShareLayer', {
    extend: 'Ext.Container',
    xtype: 'sharelayer',
    requires: ['WeiQuPai.view.WeiboShare'],
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

    show: function(){
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function(){
        WeiQuPai.Util.slideDown.call(this);
    },

    initialize: function(){
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('button[action=weibo]').on('tap', this.shareWeibo, this);
        this.down('button[action=weixin]').on('tap', this.shareWeixin, this);
        this.down('button[action=pyquan]').on('tap', this.sharePyquan, this);
    },
    
    applyShareData: function(data){
        return {
            title: data.title + ' - 微趣拍',
            thumb: data.thumb || WeiQuPai.Config.host + data.pic_cover,
            url: data.url || 'http://www.vqupai.com/mm/index.php?r=auction/show&id=' + data.id,
            description: data.description || '微趣拍'
        };
    },

    shareWeibo: function(){
        this.hide();
        WeiQuPai.Util.forward('weiboshare', {data: this.getShareData()});
    },

    shareWeixin: function(){
        this.hide();
        this.shareWechat(Wechat.Scene.SESSION);
    },

    sharePyquan: function(){
        this.hide();
        this.shareWechat(Wechat.Scene.TIMELINE);
    },

    shareWechat: function(scene){
        var t = scene == Wechat.Scene.TIMELINE ? 'wxtimeline' : 'wxfriend';
        var me = this;
        var msg = this.getShareData();
        var data = {
            message: {
                title: msg.title,
                thumb: msg.thumb,
                description: msg.description,
                media: {
                    webpageUrl: msg.url +　'&t=' + t
                }
            },
            scene: scene
        }
        Wechat.share(data, function () {
        }, function (reason) {
            //WeiQuPai.Util.toast("分享失败: " + reason);
        });
    },
});

