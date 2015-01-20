Ext.define('WeiQuPai.view.Sign', {
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
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'iframe'
        }]
    },

    initialize: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var query = WeiQuPai.Util.getDefaultParam();
        query['r'] = 'turnTable';
        var url = WeiQuPai.Config.webUrl + '/?' + Ext.Object.toQueryString(query);
        this.setHref(url);
        this.on('activate', this.loadIframe, this);
    },

    loadIframe: function() {
        //清红点
        if(WeiQuPai.Notify.hasNotify(WeiQuPai.Notify.MSG_SIGN)){
            WeiQuPai.Notify.clearNotify(WeiQuPai.Notify.MSG_SIGN);
        }

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