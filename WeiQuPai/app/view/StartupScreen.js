Ext.define('WeiQuPai.view.StartupScreen', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'startupscreen',
    config: {
        cls: 'w-imageviewer',
        picData: null,
        fullscreen: true,
        hidden: true,
        hideAnimation: 'fadeOut',
        style: 'background:#e4eee6;z-index:1'
    },

    initialize: function() {
        //Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
    },

    applyPicData: function(data) {
        this.removeAll(true);
        if (!Ext.isArray(data)) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            var item = Ext.create('Ext.Img', {
                src: data[i]
            });
            item.on('tap', this.doImageTap, this);
            this.add(item);
        }

    },

    doImageTap: function(img, e) {
        //最后一张图点击消失
        if (this.getActiveIndex() == this.getMaxItemIndex()) {
            Ext.Viewport.setActiveItem('main');
            //this.hide();
        }
    }
});