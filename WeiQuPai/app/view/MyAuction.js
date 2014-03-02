Ext.define('WeiQuPai.view.MyAuction', {
	extend: 'Ext.dataview.List',
	xtype: 'myauction',
	requires:['WeiQuPai.store.MyAuction', 'WeiQuPai.view.MyAuctionDetail', 'WeiQuPai.view.LoginTip'],
	config: {
        loadingText: null,
        disableSelection : true,
        store: 'MyAuction',
		itemTpl: new Ext.XTemplate(
                '<div class="myauction-row">',
                '<img src="' + WeiQuPai.Config.host + '{pic_cover}" />',
                '<div class="info">',
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
                docked: 'top',
                cls: 'w-title'
            }
        ],

        listeners: {
            'activate' : 'loadData'
        }
    },
    loadData: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user){
            this.getStore().removeAll();
            this.hasLoadedStore = false;
            !this.down('logintip') && this.add(Ext.create('WeiQuPai.view.LoginTip'));
            return false;
        }
        var loginTip = this.down('logintip');
        loginTip && this.remove(loginTip);
        if(this.hasLoadedStore) return;
        var store = this.getStore();
        //加载数据
        var me = this;
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(data, operation, success){
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
            }
        });
    }
});
