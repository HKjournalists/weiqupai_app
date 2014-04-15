Ext.define('WeiQuPai.view.ShowUser', {
	extend: 'Ext.dataview.List',
	xtype: 'showuser',
	config: {
		plugins: [
			{
				type: 'wlistpaging',
		        autoPaging: true,
			},
			{
				type: 'wpullrefresh',
				lastUpdatedText: '上次刷新：',
				lastUpdatedDateFormat: 'H点i分',
				loadingText: '加载中...',
				pullText: '下拉刷新',
				releaseText: '释放立即刷新',
				loadedText: '下拉刷新'
			}
		],
		loadingText: null,
		pressedCls: '',
		param: null,
		store: 'UserFeed',
		disableSelection : true,
		itemTpl: new Ext.XTemplate(
			'<div class="user-row"><div class="info">',
				'<tpl if="feed_type==0">',
					'<p>{content:htmlEncode}</p>',
				'<tpl elseif="feed_type==1">',
					'<tpl if="content"><p>{content:htmlEncode}</p></tpl>',
					'<div class="pic-list">',
					'<tpl for="json_data.pic_list"><img src="' + WeiQuPai.Config.host + '{.}" /></tpl>',
					'</div>',
					'<div class="card" dataType="item">',
						'<img src="' + WeiQuPai.Config.host + '{json_data.pic_cover}"/>',
						'<span>{json_data.title:htmlEncode}</span>',
					'</div>',
				'<tpl elseif="feed_type==2">',
					'<div class="action-title"><span class="uname" uid="{uid}">{nick:htmlEncode}</span><span class="action">拍下了一个宝贝</span></div>',
					'<p>我刚刚购买了{json_data.title:htmlEncode}</p>',
					'<div class="card" dataType="item">',
						'<img src="' + WeiQuPai.Config.host + '{json_data.pic_cover}"/>',
						'<span>{json_data.title:htmlEncode}</span>',
					'</div>',
				'</tpl>',
			    '<div class="flex"><span class="time">{ctime}</span></div>',
			'</div></div>'
		),
		items: [
			{
				xtype: 'container',
				scrollDock: 'top',
				itemId: 'user-info',
				tpl: new Ext.XTemplate(
					'<div class="user-show-top">',
						'<div class="user-show-bg">',
							'<img <tpl if="circle_bg">src="' + WeiQuPai.Config.host + '{circle_bg}"</tpl>/>',
						'</div>',
						'<div class="user-show-avatar">',
							'<img <tpl if="avatar">src="' + WeiQuPai.Config.host + '{avatar}"</tpl>/>',
							'<span class="user-show-name">{nick:htmlEncode}</span>',
						'</div>',
					'</div>'
				)
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		this.down('#user-info').on('tap', function(){
			this.fireEvent('bgtap', this.getParam());
		}, this, {element: 'element'});
		this.onBefore('itemtap', this.bindEvent, this);
		this.msgbox = WeiQuPai.Util.msgbox('这个人很懒，什么都没有留下.');
		this.add(this.msgbox);
	},

	bindEvent: function(list, index, dataItem, record, e){
		//卡片点击
		var card = Ext.get(e.target).up('.card');
		if(card){
			this.fireEvent('cardtap', this, index, record, card.getAttribute('dataType'));
			return false;
		}
	},

	applyParam: function(uid){
		var profile = WeiQuPai.model.Profile;
		profile.getProxy().setUrl(WeiQuPai.Config.apiUrl + '/?r=app/user');
		profile.load(uid, {
			scope: this,
			success: function(record, operation){
				this.down('#user-info').setRecord(record);
			},
			failure: function(record, operation){
				Ext.Msg.alert(null, '数据加载失败');	
			}
		});
		var me = this;
		var store = this.getStore();
		store.removeAll();
		store.getProxy().setUrl(WeiQuPai.Config.apiUrl + '/?r=app/circle/userFeed');
		store.getProxy().setExtraParam('uid', uid);
		store.load(function(records, operation, success){
			if(!success){
				Ext.Msg.alert(null, '数据加载失败');
				return false;
			}
			if(records.length == 0){
				this.msgbox.show();
				return;
			}
		}, this);
		return uid;
	}
});
