Ext.define('WeiQuPai.view.ImageViewer', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'imageviewer',
    config: {
        cls: 'w-imageviewer',
        picData: null,
        fullscreen: true,
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        hidden: true,
        style: 'background:#000;z-index:1'
    },

    initialize: function() {
        //Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
        this.on('show', WeiQuPai.Util.saveLastView, this);
    },

    applyPicData: function(data) {
        this.removeAll(true);
        if (!Ext.isArray(data)) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            var item = Ext.create('Ext.ux.ImageViewer', {
                imageSrc: WeiQuPai.Util.getImagePath(data[i]),
                previewSrc: WeiQuPai.Util.getImagePath(data[i], '640'),
                doubleTapScale: 0,
                loadingMask: false
            });
            this.add(item);
        }
        this.on('tap', this.doImageTap, this, {
            element: 'element'
        });

    },

    doImageTap: function(img, e) {
        this.hide();
    }
});