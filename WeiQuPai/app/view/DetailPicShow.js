Ext.define('WeiQuPai.view.DetailPicShow', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'detailpicshow',
    config: {
        direction: 'horizontal',
        style: 'height:200px;background-size:100% auto;',
        cls: 'detail',
        directionLock: true,
        indicator: true,
        picData: null
    },

    applyPicData: function(data, oldData) {
        if (!Ext.isArray(data)) {
            return false;
        }
        this.removeAll();
        for (var i = 0; i < data.length; i++) {
            var item = Ext.create('Ext.Img', {
                src: WeiQuPai.Util.getImagePath(data[i], '290')
            });
            item.on('tap', this.doImageTap, this);
            this.add(item);
        }
        this.setActiveItem(0);
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setPicData(data);
        return data;
    },

    doImageTap: function(img, e) {
        var idx = this.getActiveIndex();
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setActiveItem(idx);
        viewer.show();
    }
});