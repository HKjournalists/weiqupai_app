Ext.define('WeiQuPai.view.KillTip', {
    extend: 'Ext.Container',
    xtype: 'killtip',
    config: {
        hidden: true,
        showAnimation: 'fadeIn',
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip_kill'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                })

            }
        }
    }
});