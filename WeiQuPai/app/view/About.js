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
            flex: 1,
            cls: 'about',
            html: '<div class="aboutTop"></div>' +
                '<div class="aboutdis">' +
                '<div class="aboutcontent">' +
                '<ul>' +
                '<li><br><br>欢迎来到微趣拍，全球首家互动娱乐网上购物平台！</li>' +
                '<li>微趣拍首创了“变价购物”模式：每天精选几十款品牌商品以全网最低价为您推荐，商品的价格并非一成不变，价格体系由两部分组成，平台系统在特定时间内为商品随机变价，您也可以利用平台内的玩法规则左右商品价格。</li>' +
                '<li>微趣拍的团队致力于为您提供“发现有趣、有品、有爱的生活”的服务。</li>' +
                '<li>让我们一起发现生活：微趣拍代表一种新的生活方式、一种新的生活态度、一种新的生活状态、一种新的生活滋味。</li>' +
                '<li>欢迎来到微趣拍，全球首家互动娱乐网上购物平台！</li>' +
                '<li>欢迎来到微趣拍，全球首家互动娱乐网上购物平台！</li>' +
                '<li>在这里，我们尽力为您提供——有趣：有趣的购物模式，有趣的社交，有趣的商品。<br>在这里，我们尽力为您提供——有品：平台的商品都是我们为您精心挑选的品牌商品。<br>在这里，我们尽力为您提供——有爱：您可以和朋友、亲人、爱人在微趣拍的平台上互相帮忙，相互分享，互动让爱更容易表达。</li>' +
                '<li>微趣拍作为全球首家互动娱乐网上购物平台，它颠覆了电商1.0时代纯以交易为目的的短平快购物体验，颠覆了电商2.0时代导购式的购物体验，与此同时，开启了电商3.0新时代——互动娱乐式购物体验。</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
        }]
    }

});