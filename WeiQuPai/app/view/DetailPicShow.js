Ext.define('WeiQuPai.view.DetailPicShow', {
    extend: 'Ext.Panel',
    xtype: 'detailpicshow',
    requires: ['Ext.Img', 'Ext.carousel.Carousel', 'WeiQuPai.view.ImageViewer'],
    config: {
        direction: 'horizontal',
        style: 'height:200px;background-size:100% auto;',
        cls: 'detail',
        directionLock: true,
        indicator: true,
        picData: null
    },

    contentTpl: new Ext.XTemplate(
        '<div class="details">',
        '<div class="top">',
        '<div class="right">',
        '<ul>',
        '<li class="heart public_detail">',
        '{item_stat.like_num}',
        '</li>',
        '<li class="nolike public_detail">',
        '{item_stat.}',
        '</li>',
        '<li class="pre public_detail">',
        '{disdata}',
        '</li>',
        '</ul>',
        '</div>',
        '</div>',
        '<div class="bottom">',
        '<div class="left">',
        '{title}',
        '</div>',
        '<div class="right">',
        '<ul>',
        '<li class="nolike">',
        '</li>',
        '<li class="like">',
        '</li>',
        '</ul>',
        '</div>',
        '</div>',
        '</div>'
    ),

    applyPicData: function(data, oldData) {
        if (!Ext.isArray(data)) {
            return false;
        }
        var com = this.down('carousel');
        for (var i = 0; i < data.length; i++) {
            var item = Ext.create('Ext.Img', {
                src: WeiQuPai.Util.getImagePath(data[i], '290')
            });
            item.on('tap', this.doImageTap, this);
            com.add(item);
        }
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setPicData(data);
        return data;
    },

    doImageTap: function(img, e) {
        var idx = this.down('carousel').getActiveIndex();
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
        viewer.setActiveItem(idx);
        viewer.show();
    }
});