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
            if (tag == 'img') {
                WeiQuPai.app.statReport({
                    act: 'desc_pic_tap'
                });
                var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.SimpleViewer');
                var spic = WeiQuPai.Util.getImagePath(url);
                var bpic = spic;
                viewer.setPic(spic, bpic);
                viewer.show();
            } else if (tag == 'a') {
                var title = e.target.title || '微趣拍';
                window.open(e.target.href, '_blank', 'location=no,title=' + title);
            }
            return false;
        }, this);
    }
});