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
        ]

    },

    initialize: function(){
        this.callParent(arguments);

        this.msgbox = WeiQuPai.Util.msgbox('您还没有拍到任何宝贝');
        this.add(this.msgbox);

        this.loginTip = Ext.create('WeiQuPai.view.LoginTip');
        this.add(this.loginTip);

        this.on('activate', this.loadData, this);
    },

    loadData: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user){
            this.getStore().removeAll();
            this.loginTip.show();
            return false;
        }
        this.loginTip.hide();
        var store = this.getStore();
        //加载数据
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success){
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
                return false;
            }
            if(records.length == 0){
                this.msgbox.show();
                return;
            }
            //登录超时
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
                store.removeAll();
                return false;
            }
        }, this);
    }
});
