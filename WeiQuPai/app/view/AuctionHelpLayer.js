Ext.define('WeiQuPai.view.AuctionHelpLayer', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'auctionhelplayer',
    config: {
        cls: 'w-imageviewer',
        fullscreen: true,
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        hidden: true,
        style: 'background:rgba(0,0,0, .4)',
    },

    initialize: function() {
        var data = [
            'resources/images/help1.png', 'resources/images/help2.png',
            'resources/images/help3.png', 'resources/images/help4.png'
        ];
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.initPicData(data);
    },

    initPicData: function(data) {
        for (var i = 0; i < data.length; i++) {
            var item = Ext.create('Ext.Img', {width:'80%', margin:'10%'});
            item.setSrc(data[i]);
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