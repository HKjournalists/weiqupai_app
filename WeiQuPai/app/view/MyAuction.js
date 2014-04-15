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
                '<h2>{title}</h2>',
                '<p>成交价<span class="fbig">￥{price}</span>',
                '<tpl if="rank != -1">',
                '<p>此价格击败了<span class="fbig">{rank}%</span>的拍友</p>',
                '</tpl>',
                '<p>{ctime}</p>',
            '</div>',
            '<tpl if="this.notPay(status)">',
            '<div class="pay-btn-wrap"><div class="pay-btn">去支付</div></div>',
            '</tpl>',
            {
                notPay: function(status){
                    return status == WeiQuPai.Config.orderStatus.STATUS_TOPAY;
                }
            }
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

        this.onBefore('itemtap', function(list, index, dataItem, record, e){
            if(e.target.className == 'pay-btn'){
                this.fireEvent('gopay', list, index, dataItem, record, e);
                return false;
            }
        }, this);
    },

    loadData: function(){
        var user = WeiQuPai.Cache.get('currentUser');
        if(!user){
            this.getStore().removeAll();
            this.msgbox.hide();
            this.loginTip.show();
            return false;
        }
        this.loginTip.hide();
        this.msgbox.hide();
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
