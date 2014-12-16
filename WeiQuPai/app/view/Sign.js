Ext.define('WeiQuPai.view.Sign'
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.Iframe'],
    xtype: 'sign',
    config: {
        href: null,

        //返回时是否重新加载
        reloadOnBack: false,
        items: [{
            xtype: 'vtitlebar',
            title: '签到抽奖',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'iframe'
        }]
    },


    initialize: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.webUrl + '/?r=turnTable&token=' + user.token;
        this.setHref(url);
        this.loadIfrmae();
    },

    loadIframe: function() {
        this.setMasked({
            xtype: 'wloadmask'
        });
        var iframe = this.down('iframe').element.query('iframe')[0];
        var me = this;
        iframe.onload = function() {
            me.iframeLoad();
        };
        iframe.src = this.getHref();
    },

    iframeLoad: function() {
        this.unmask();
    }
});