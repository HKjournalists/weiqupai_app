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
                '<p>微趣拍首创了“变价购物”模式：商品的价格并非一成不变，价格体系由两部分组成，平台系统在特定时间内为商品随机变价，您也可以利用平台内的玩法规则左右商品价格。</p>' +
                '<p>微趣拍的团队致力于为您提供“最好玩的购物APP”！</p>' +
                '<p>微趣拍代表一种新的生活方式、一种新的生活态度、一种新的生活状态、一种新的生活滋味。</p>' +
                '<p>让我们一起抢先享受这种新的互动娱乐式购物体验，一起玩最好玩的购物APP！</p>' +
                '</div>' +
                '<div class="copyright">' + 
                '<p>北京智博云威网络科技有限公司 版权所有</p>' + 
                '<p>Copyright © 2014 Beijing ZhiBoYunWei network technology Co. Ltd.</p>' + 
                '</div>'
        }]
    }

});