Ext.define('WeiQuPai.view.ScoreRule', {
    extend: 'Ext.Container',
    xtype: 'scorerule',
    config: {
        cls: 'bg_ef',
        scrollable: true,
        items: [{
            xtype: 'vtitlebar',
            title: '积分规则',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'ruleText',
            cls: 'w-content',
            flex: 1
        }]
    },

    initialize: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        var token = user && user.token || '';
        var url = WeiQuPai.Util.apiUrl('r=appv2/scoreRule');
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            me.setContent(rsp);
        });
    },

    setContent: function(rsp) {
        html = ['<p>'];
        html = html.concat(rsp.content);
        html = html.join('</p><p>') + '</p>';
        this.down('#ruleText').setHtml(html);
    }

});