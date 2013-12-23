Ext.define('WeiQuPai.view.MyAuction', {
	extend: 'Ext.dataview.List',
	xtype: 'myauction',
	requires:['WeiQuPai.view.MyAuctionDetail'],
	config: {
		emtpyText: '没有可用的商品',
		store: 'Item',
        disableSelection : true,
		itemTpl: ['<div class="myauction-item-row">',
                '<div class="myauction-item-pic">',
                    '<img src="http://localhost:8080/WeiQuPai/{pic_url}" />',
                    '<p>{name}</p>',
                '</div>',
                '<div class="myauction-item-info">',
                    '<h2>{name}</h2>',
                    '<p>成交价 <span class="f36">{price}</span>',
                    '<p>此价格击败了<span class="f36">89%</span>的拍友</p>',
                    '<p>2013-11-20 11:24</p>',
                    '<p>北京市创新商贸有限公司',
                '</div>'].join(''),
        onItemDisclosure : true,
    }
});
