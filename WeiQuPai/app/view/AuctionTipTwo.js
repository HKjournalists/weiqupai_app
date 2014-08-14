Ext.define('WeiQuPai.view.AuctionTipTwo', {
    extend: 'Ext.Container',
    xtype: 'auctiontiptwo',
    config: {
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip2'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                })

            }
        }
    }
});