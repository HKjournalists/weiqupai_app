Ext.define('WeiQuPai.view.MainTip', {
    extend: 'Ext.Container',
    xtype: 'maintip',
    config: {
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip_main'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                })

            }
        }


    }

});