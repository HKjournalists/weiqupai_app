/**
 *  分享的弹层
 *
 */
Ext.define('WeiQuPai.view.ShareLayer', {
    extend: 'Ext.Container',
    xtype: 'sharelayer',
    config: {
        shareData: null,
        shareCallback: null,
        cls: 'w-poplayer share-layer',
        items: [{
            xtype: 'container',
            cls: 'share-title',
            html: '<h2>分享到</h2>'
        }, {
            xtype: 'container',
            cls: 'share-icon',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                text: '微博',
                action: 'weibo',
                baseCls: 'xl-share-button',
                flex: 1
            }, {
                xtype: 'button',
                text: '微信',
                action: 'weixin',
                baseCls: 'wx-share-button',
                flex: 1
            }, {
                xtype: 'button',
                text: '朋友圈',
                action: 'pyquan',
                baseCls: 'pyq-share-button',
                flex: 1
            }]
        }, {
            xtype: 'button',
            action: 'cancel',
            text: '返回',
            baseCls: 'w-popbutton'
        }]
    },

    show: function() {
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function() {
        WeiQuPai.Util.slideDown.call(this);
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('button[action=weibo]').on('tap', this.shareWeibo, this);
        this.down('button[action=weixin]').on('tap', this.shareWeixin, this);
        this.down('button[action=pyquan]').on('tap', this.sharePyquan, this);
    },

    applyShareData: function(data) {
        data.title = data.title + ' - 微趣拍';
        data.description = data.description || '微趣拍';
        return data;
    },

    shareWeibo: function() {
        this.hide();
        var data = this.getShareData();
        var param = {
            title: data.title,
            url: data.url + '&t=weibo',
            pic: data.thumb,
            searchPic: 'false',
            appkey: '269670787'
        }
        var me = this;
        var query = Ext.Object.toQueryString(param);
        var url = 'http://service.weibo.com/share/mobile.php?' + query;
        var win = window.open(url, '_blank', 'location=no,title=微博分享,closebuttoncaption=关闭');
        var shareSuccess = false;
        win.addEventListener('loadstop', function(e) {
            if (e.url.indexOf('http://service.weibo.com/share/msuccess') >= 0) {
                shareSuccess = true;
            }
        }, false);
        win.addEventListener('exit', function(e) {
            if (shareSuccess) {
                Ext.isFunction(me.getShareCallback()) && me.getShareCallback().call(this);
            }
        });

        //上报统计
        WeiQuPai.app.statReport({
            act: 'shareweibo'
        });
    },
    shareWeixin: function() {
        this.hide();
        this.shareWechat(Wechat.Scene.SESSION);
        WeiQuPai.app.statReport({
            act: 'sharewechat'
        });
    },

    sharePyquan: function() {
        this.hide();
        this.shareWechat(Wechat.Scene.TIMELINE);
        WeiQuPai.app.statReport({
            act: 'sharetimeline'
        });
    },

    shareWechat: function(scene) {
        var t = scene == Wechat.Scene.TIMELINE ? 'wxtimeline' : 'wxfriend';
        var me = this;
        var msg = this.getShareData();
        var data = {
            message: {
                title: msg.title,
                thumb: msg.thumb,
                description: msg.description,
                media: {
                    webpageUrl: msg.url + 　'&t=' + t
                }
            },
            scene: scene
        }
        Wechat.share(data, function() {
            Ext.isFunction(me.getShareCallback()) && me.getShareCallback().call(this);
        }, function(reason) {
            //WeiQuPai.Util.toast("分享失败: " + reason);
        });
    },
});