Ext.define('WeiQuPai.view.About', {
    extend: 'Ext.Container',
    xtype: 'about',
    config: {
        scrollable: true,
        layout: 'vbox',
        cls: 'bg_ef',
        items: [{
            xtype: 'vtitlebar',
            title: '关于微趣拍',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'about',
            html: '<div class="about-logo">微趣拍 ' + WeiQuPai.Config.version + '</div>' +
                '<div class="about-content">' +
                '<p>欢迎来到微趣拍，微趣拍是北京智博云威网络科技有限公司打造的全球首家互动娱乐网上购物平台！</p>' +
                '<p>微趣拍团队致力于让购物更加好玩儿，首创了“血战到底”模式：在app内创建商品血战，分享到朋友圈请好友帮忙杀价，享受超低底价！</p>' +
                '<p>微趣拍代表一种新的生活方式、一种新的生活态度、一种新的生活状态、一种新的生活滋味。</p>' +
                '<p>让我们一起尽情享受购物的乐趣吧！</p>' +
                '<p>让我们一起抢先享受这种新的互动娱乐式购物体验，一起玩最好玩的购物APP！</p>' +
                '</div>' +
                '<div class="copyright">' + 
                '<p>北京智博云威网络科技有限公司 版权所有</p>' + 
                '<p>Copyright © 2014 Beijing ZhiBoYunWei network technology Co. Ltd.</p>' + 
                '</div>'
        }]
    }

});