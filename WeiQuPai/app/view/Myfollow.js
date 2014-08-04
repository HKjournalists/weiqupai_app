Ext.define('WeiQuPai.view.Myfollow', {
    extend: 'Ext.DataView',
    xtype: 'myfollow',
    config: {
        uid: null,
        loadingText: null,
        disableSelection: true,
        scrollable: true,
        cls: 'bg_ef myfen',
        store: 'Myfollow',
        itemTpl: new Ext.XTemplate(
            '<div class="myfollow" >',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" width="40">',
            '</div>',
            '<div class="name">',
            '{nick}',
            '</div>',
            '</div>'

        ),


        items: [{
            xtype: 'vtitlebar',
            title: '我的关注',
            cls: 'titlebar3',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }]
    },
    initialize: function() {
        // this.loadData();
        this.onBefore('itemtap', this.bindEvent, this);
        var user = WeiQuPai.Cache.get('currentUser');
        this.callParent(arguments);
        var store = this.getStore();
        console.log(store);
        store.getProxy().setExtraParam('token', user.token);
        this.getStore().load();

    },

    bindEvent: function(e) {
        // var me = this;
        // if (e.target.className == 'myfollow') {
        //     me.fireEvent('persontap', me, e);
        //     return false;

    },
    loadData: function() {

        var user = WeiQuPai.Cache.get('currentUser');
        var person = this.down('#myfollow');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/follow',
            method: 'post',
            params: {

                token: user.token
            },
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code && rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
                person.setData(rsp);
            },
            failure: function(rsp) {
                WeiQuPai.Util.toast('请求失败，请重试');
            }
        });

    },

})