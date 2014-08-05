Ext.define('WeiQuPai.view.Banner', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'banner',
    config: {
        paramType: 'index',
        direction: 'horizontal',
        style: 'height:132px;background-size:100% auto;',
        directionLock: true,
        indicator: true
    },
    timer: null,

    bannerTpl: new Ext.XTemplate(
        '<div class="banner">',
        '<div class="price">',
        '<span class="color_e7">',
        '{auction.curr_price}',
        '</span>',
        '</div>',
        '</div>'
    ),

    //更新爆款商品的价格
    updatePrice: function(idx, price) {
        var item = this.query('img')[idx];
        var data = item.getData();
        data['auction'].curr_price = price;
        item.setData(data);
    },

    updateBanner: function(data) {
        this.stopTimer();
        this.removeAll(true);
        for (var i = 0; i < data.length; i++) {
            var img = Ext.create('Ext.Img', {
                src: WeiQuPai.Util.getImagePath(data[i].pic_url)
            });
            if (data[i].auction) {
                img.setSrc(WeiQuPai.Util.getImagePath(data[i].auction.item.pic_cover));
                img.setTpl(this.bannerTpl);
            }
            img.setData(data[i]);
            img.on('tap', this.doImageTap, this);
            this.add(img);
        }
        this.setActiveItem(0);
        this.startTimer();
    },

    startTimer: function() {
        var self = this;
        this.timer = setInterval(function() {
            if (self.getActiveIndex() == self.getMaxItemIndex()) {
                self.setActiveItem(0);
                return;
            }
            self.next();
        }, 5000);
    },

    stopTimer: function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    doImageTap: function(img) {
        var data = img.getData();
        if (data.type == 3) {
            WeiQuPai.Util.goItemView(data.auction.item_id);
            return;
        }
        if (!data.link) return;
        if (data.type == 1) {
            window.open(data.link, '_system');
            return;
        }
        var view = Ext.create('WeiQuPai.view.WebPage');
        view.setHref(data.link);
        view.setReloadOnBack(true);
        view.setTitle(data.title || '微趣拍');
        Ext.Viewport.down('main').push(view);
    }
});