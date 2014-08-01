Ext.define('WeiQuPai.view.VTitleBar', {
    xtype: 'vtitlebar',
    extend: 'Ext.TitleBar',

    initialize: function() {
        this.callParent(arguments);
        var idx = Math.floor(Math.random() * 3) + 1;
        this.addCls('titlebar' + idx);

        this.bindEvent();
    },

    listeneComp: {},

    onItemAdd: function() {
        this.callParent(arguments);
        this.bindEvent();
    },

    bindEvent: function() {
        var ucenter = this.down('button[action=ucenter]');
        if (ucenter && !this.listeneComp.ucenter) {
            this.listeneComp.ucenter = 1;
            ucenter.on('tap', function() {
                WeiQuPai.sidebar.toggle();
            })
        }

        var back = this.down('button[action=back]');
        if (back && !this.listeneComp.back) {
            this.listeneComp.back = 1;
            back.on('tap', function() {
                WeiQuPai.navigator.pop();
            });
        }

        var refresh = this.down('button[action=refresh]');
        if (refresh && !this.listeneComp.refresh) {
            this.listeneComp.refresh = 1;
            refresh.on('tap', function() {
                this.getParent().fireEvent('refresh', refresh);
            }, this);
        }
    }
});