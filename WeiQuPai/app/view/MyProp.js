Ext.define('WeiQuPai.view.MyProp', {
	extend: 'Ext.dataview.List',
	xtype: 'myprop',
	config: {
		store: 'UserProp',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="{prop_info.pic_url}"/>',
			'<p>{prop_info.name} X {num}</p>',
			'</div>'
		),
		items:[
			{
                xtype: 'titlebar',
                title: '我的道具',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		var user = WeiQuPai.Util.checkLogin();
		if(!user) return;

		this.msgbox = WeiQuPai.Util.msgbox('您还没有任何可使用的道具');
		this.add(this.msgbox);

		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		store.load(function(records, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if(records.length == 0){
            	this.msgbox.show();
            	return;
            }
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
            	store.removeAll();
            	return false;
            }
        }, this);
	}
});
