Ext.define('WeiQuPai.view.KillendTip', {
    extend: 'Ext.Container',
    xtype: 'killendtip',
    config: {
        hidden: true,
        showAnimation: 'fadeIn',
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip_killend'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                })

            }
        }
    }
});