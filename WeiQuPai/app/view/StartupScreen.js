Ext.define('WeiQuPai.view.StartupScreen', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'startupscreen',
    config: {
        cls: 'w-imageviewer',
        picData: null,
        fullscreen: true,
        hidden: true,
        hideAnimation: 'fadeOut',
        direction: 'vertical',
        indicator: false,
        style: 'background:#fffffa;z-index:1',
        html: "<div class='startupbtn'></div>"
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

        this.on('activeitemchange', function() {
            if (this.getActiveIndex() == this.getMaxItemIndex()) {
                this.element.down('.startupbtn').addCls('hidden');
            } else {
                this.element.down('.startupbtn').removeCls('hidden');
            }
        }, this);
    },

    doImageTap: function(img, e) {
        //最后一张图点击消失
        if (this.getActiveIndex() == this.getMaxItemIndex()) {
            Ext.Viewport.setActiveItem('main');
            var maintip = WeiQuPai.Util.getGlobalView('WeiQuPai.view.MainTip');
            maintip.show();
            //this.hide();
        }
    }
});