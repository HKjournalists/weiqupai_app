Ext.define('WeiQuPai.controller.PrivateMessage', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'privatemessage',

        },
        control: {
            pageView: {
                sendmsg: 'doSendMsg'
            }
        }
    },

    doSendMsg: function() {
        var view = this.getPageView();
        var receiver = view.getUid();
        var content = view.down('textfield[name=content]').getValue();
        if (content.trim().length == 0) {
            return;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Util.apiUrl('r=appv2/message/send');
        var data = {
            receiver: receiver,
            content: content,
            token: user.token
        }
        var user = WeiQuPai.Cache.get('currentUser');
        WeiQuPai.Util.post(url, data, function(rsp) {
            view.down('textfield[name=content]').reset();
            data.sender = {
                id: user.id,
                avatar: user.avatar,
                nick: user.nick
            };
            data.content = {
                content: data.content
            };
            view.getStore().add(data);
            setTimeout(function() {
                var scroller = view.getScrollable().getScroller();
                scroller.refresh();
                scroller.scrollToEnd(true);
            }, 200);

        }, {
            mask: true
        });
    }

});