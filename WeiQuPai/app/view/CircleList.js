Ext.define('WeiQuPai.view.CircleList', {
        extend: 'Ext.dataview.List',
        xtype: 'circlelist',
        config: {
                emtpyText: '没有可用的商品',
                store: 'Circle',
                disableSelection : true,
                itemTpl: ['<div class="item-row">',
                '<img src="http://localhost:8080/WeiQuPai/{pic_url}" />',
                '<div class="item-info">',
                '<h2>{name}</h2>',
                '<p>现价 {price} / <span class="market-price">市场价 {price}</span></p>',
                '<p>已拍 {sold_num}  关注 {attention}</p>',
                '</div>'].join(''),
        items: [
                {
                        //xtype: 'indexad',
                        scrollDock: 'top',
                        height: '80px'
                }
        ]
        }
});
