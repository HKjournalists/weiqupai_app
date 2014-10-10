Ext.define('WeiQuPai.view.SimpleViewer', {
    extend: 'Ext.Container',
    xtype: 'simpleviewer',
    requires: ['Ext.ux.ImageViewer'],
    config: {
        cls: 'w-imageviewer',
        fullscreen: true,
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        hidden: true,
        style: 'background:#000;z-index:1000',
        layout: 'fit'
    },

    initialize: function() {
        //Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
        this.on('show', WeiQuPai.Util.saveLastView, this);
    },

    setPic: function(pic, bigPic) {
        var img = Ext.create('Ext.ux.ImageViewer', {
            imageSrc: bigPic,
            previewSrc: pic,
            doubleTapScale: 0,
            loadingMask: false,
        });
        this.removeAll();
        this.add(img);
        this.on('tap', this.doTap, this, {
            element: 'element'
        });
    },

    doTap: function() {
        this.hide();
    }
});