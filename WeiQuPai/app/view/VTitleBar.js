Ext.define('WeiQuPai.view.VTitleBar', {
    xtype: 'vtitlebar',
    extend: 'Ext.TitleBar',

    config: {
        listenerComp: {}
    },

    initialize: function() {
        this.callParent(arguments);
        if (this.getCls().indexOf('x-navigation-bar') != -1) {
            var idx = Math.floor(Math.random() * 3) + 1;
            this.addCls('titlebar' + idx);
        }
        this.bindEvent();
    },

    bindEvent: function() {
        var comp = this.getListenerComp();
        var ucenter = this.down('button[action=ucenter]');
        if (ucenter && !comp.ucenter) {
            comp.ucenter = 1;
            ucenter.on('tap', function() {
                WeiQuPai.sidebar.open();
            })
        }

        var back = this.down('button[action=back]');
        if (back && !comp.back) {
            comp.back = 1;
            back.on('tap', function() {
                WeiQuPai.navigator.pop();
            });
        }
        this.setListenerComp(comp);
    }
});