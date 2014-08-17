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
    }
    // initialize: function() {
    //     this.callParent(arguments);
    //    this.on('itemtap', function(list, index, dataItem, record, e) {
    //         if (e.target.name == 'img') {
    //             this.fireEvent('zantap', this, index, dataItem, record, e);
    //             return false;
    //         }
    //         this.fireEvent('detailtap', this, index, dataItem, record, e);
    //     }, this);
    // },

    // applyPicData: function(data, oldData) {
    //     data = Ext.isArray(data) ? data : [data];
    //     this.removeAll();
    //     for (var i = 0; i < data.length; i++) {
    //         var item = Ext.create('Ext.Img', {
    //             src: WeiQuPai.Util.getImagePath(data[i])
    //         });
    //         item.on('tap', this.doImageTap, this);
    //         this.add(item);
    //     }
    //     this.setActiveItem(0);
    //     var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
    //     viewer.setPicData(data);
    //     return data;
    // },

    // doImageTap: function(img, e) {
    //     var idx = this.getActiveIndex();
    //     var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
    //     viewer.setActiveItem(idx);
    //     viewer.show();
    // }
});