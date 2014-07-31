Ext.define('WeiQuPai.view.TitleBar', {
    xtype: 'vtitlebar',
    extend: 'Ext.TitleBar',

    initialize: function() {
        this.callParent(arguments);
        var idx = Math.floor(Math.random() * 3) + 1;
        this.addCls('titlebar' + idx);

        this.bindEvent();
    },

    bindEvent: function() {
        var ucenter = this.down('button[action=ucenter]');
        if (ucenter) {
            ucenter.on('tap', function() {
                WeiQuPai.sidebar.toggle();
            })
        }

        var back = this.down('button[action=back]');
        if (back) {
            back.on('tap', function() {
                WeiQuPai.navigator.pop();
            });
        }

        var refresh = this.down('button[action=refresh]');
        if (refresh) {
            refresh.on('tap', function() {
                this.getParent().fireEvent('refresh', refresh);
            }, this);
        }
    }
});