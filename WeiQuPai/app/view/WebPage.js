Ext.define('WeiQuPai.view.WebPage', {
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.Iframe'],
    xtype: 'webpage',
    config: {
        title: null,
        href: null,

        //返回时是否重新加载
        reloadOnBack: false,
        items: [{
            xtype: 'vtitlebar',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'iframe'
        }]
    },

    firstLoad: true,

    initialize: function() {
        this.on('activate', this.onActivate, this);
    },

    applyTitle: function(title) {
        this.down('titlebar').setTitle(title || '微趣拍');
        return title;
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
        var href = iframe.src || this.getHref();
        var query = WeiQuPai.Util.getDefaultParam();
        href = Ext.String.urlAppend(href, Ext.Object.toQueryString(query));
        iframe.src = href;
    },

    iframeLoad: function() {
        this.unmask();
    },

    onActivate: function() {
        if (this.firstLoad || this.getReloadOnBack()) {
            this.firstLoad = false;
            this.loadIframe();
        }
    }
});