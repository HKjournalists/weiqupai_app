Ext.define('WeiQuPai.view.ItemDesc', {
    extend: 'Ext.Container',
    xtype: 'itemdesc',
    config: {
        cls: 'discard tuwen',
        tpl: '{content}',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                cls: 'detail_listOne',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]
    },

    initialize: function() {
        this.element.onBefore('tap', function(e) {
            var tag = e.target.tagName.toLowerCase();
            if (tag == 'img' && e.target.src.indexOf("twxq_") == -1) {
                WeiQuPai.app.statReport({
                    act: 'itemdesc_pic_tap'
                });
                var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.SimpleViewer');
                var spic = WeiQuPai.Util.getImagePath(e.target.src);
                var bpic = spic;
                viewer.setPic(spic, bpic);
                viewer.show();
            }
            return false;
        }, this);
    }
});