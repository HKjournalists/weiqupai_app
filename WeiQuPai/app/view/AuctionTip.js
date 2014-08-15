Ext.define('WeiQuPai.view.AuctionTip', {
    extend: 'Ext.Container',
    xtype: 'auctiontip',
    requires: [
        'WeiQuPai.view.AuctionTipTwo'
    ],
    config: {
        hidden: true,
        showAnimation: 'fadeIn',
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip1'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                    var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.AuctionTipTwo');
                    view.show();
                })

            }
        }
    }
});