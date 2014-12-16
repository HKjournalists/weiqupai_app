Ext.define('WeiQuPai.view.Banner', {
    extend: 'Ext.carousel.Carousel',
    xtype: 'banner',
    config: {
        paramType: 'index',
        direction: 'horizontal',
        cls: 'banner_img',
        style: 'height:130px;background-size:100% auto;background:white;',
        directionLock: true,
        indicator: true
    },
    timer: null,

    bannerTpl: new Ext.XTemplate(
        '<div class="banner">',
        '<div class="price">',
        '<span class="color_e7">',
        '￥{kill.reserve_price}',
        '</span>',
        '</div>',
        '</div>'
    ),

    updateBanner: function(data) {
        this.stopTimer();
        this.removeAll(true);
        for (var i = 0; i < data.length; i++) {
            var img = Ext.create('Ext.Img', {
                src: WeiQuPai.Util.getImagePath(data[i].pic_url)
            });
            if (data[i].auction) {
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
        //type 1 外部链接 2 活动页面iframe 3 爆款 4 app内跳转
        if (data.type == 1) {
            window.open(data.link, '_system');
        }
        else if(data.type == 2){
            var view = Ext.create('WeiQuPai.view.WebPage');
            view.setHref(data.link);
            view.setReloadOnBack(true);
            view.setTitle(data.title || '微趣拍');
            Ext.Viewport.down('main').push(view);
        }
        else if (data.type == 3) {
            WeiQuPai.app.getController('Routes').showKillDetail(data.kill.id);
        }
        else if(data.type == 4){
            WeiQuPai.app.getHistory().fireEvent('change', data.link);
        }
    }
});