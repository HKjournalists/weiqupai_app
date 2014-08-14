Ext.define('WeiQuPai.view.NoticeTip', {
    extend: 'Ext.Container',
    xtype: 'noticetip',
    config: {
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        html: "<div>" +
            "<div class='dialog'>" +
            "<div class='dialog_tip3'></div></div>",
        listeners: {
            painted: function(pp) {
                pp.on('tap', function() {
                    this.hide();
                })

            }
        }


    }

});