Ext.define('WeiQuPai.view.AppUpdate', {
    extend: 'Ext.Container',
    xtype: 'appupdate',
    config: {
        scrollable: true,
        items: [{
            xtype: 'vtitlebar',
            title: '版本更新',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'releaseLog',
            cls: 'w-content'
        }, {
            xtype: 'button',
            text: '前去下载最新版本',
            action: 'download',
            cls: 'w-button',
            hidden: true
        }]
    },

    initialize: function() {
        //清除消息
        WeiQuPai.Notify.clearNotify(WeiQuPai.Notify.MSG_APP_UPDATE);

        this.down('button[action=download]').on('tap', function() {
            var url = 'http://www.vqupai.com/d.php';
            window.open(url, '_system');
        });

        var user = WeiQuPai.Cache.get('currentUser');
        var token = user && user.token || '';
        var url = WeiQuPai.Config.apiUrl + '/?r=app/appUpdate&ver=' + WeiQuPai.Config.version + '&token=' + token;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            me.setContent(rsp);
        });
    },

    setContent: function(rsp) {
        if (!rsp['new']) {
            this.down('#releaseLog').setHtml('当前已经是最新版本了.');
            return;
        }
        html = ['<h2 style="margin-bottom:1em">最新版本 ' + rsp['ver'] + '</h2><p>'];
        if (rsp['log']) html = html.concat(rsp['log']);
        html = html.join('</p><p>') + '</p>';
        this.down('#releaseLog').setHtml(html);
        this.down('button[action=download]').show();
    }

});