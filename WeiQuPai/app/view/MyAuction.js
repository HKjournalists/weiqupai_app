Ext.define('WeiQuPai.view.MyAuction', {
	extend: 'Ext.dataview.List',
	xtype: 'myauction',
	requires:['WeiQuPai.store.MyAuction', 'WeiQuPai.view.MyAuctionDetail', 'WeiQuPai.view.LoginTip'],
	config: {
		emptyText: '您还没有拍到任何宝贝',
        disableSelection : true,
        store: 'MyAuction',
		itemTpl: new Ext.XTemplate(
                '<div class="myauction-row">',
                '<img src="' + WeiQuPai.Config.host + '{pic_url}" />',
                '<div class="myauction-info">',
                    '<h2>{item_title}</h2>',
                    '<p>成交价 <span class="fbig">{price}</span>',
                    '<p>此价格击败了<span class="fbig">{defeated}%</span>的拍友</p>',
                    '<p>{ctime}</p>',
                '</div>'
                ),
        items: [
            {
                xtype: 'titlebar',
                title: '已拍',
                docked: 'top'
            }
        ],

        listeners: {
            'activate' : 'loadData'
        }
    },
    loadData: function(){
        if(!WeiQuPai.Util.isLogin()){
            !this.down('logintip') && this.add(Ext.create('WeiQuPai.view.LoginTip'));
            return false;
        }
        var loginTip = this.down('logintip');
        loginTip && this.remove(loginTip);
        var store = this.getStore();
        if(store.isLoaded()) return;
        //加载数据
        var me = this;
        store.load(function(data, operation, success){
            if(!success){
                me.setEmptyText('网络不给力哦～');
            }
        });
    }
});
