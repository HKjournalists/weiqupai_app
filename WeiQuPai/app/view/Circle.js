/**
 * 拍圈的view
 */
Ext.define('WeiQuPai.view.Circle', {
	extend: 'Ext.dataview.List',
	xtype: 'circle',
	requires: [
		'WeiQuPai.view.Banner', 'WeiQuPai.view.ShowUser', 'WeiQuPai.view.DeleteButtonLayer', 'WeiQuPai.view.AddFriendButtonLayer'
	],
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
		//是否清空store并刷新
		forceReload: false,
		loadingText: null,
		pressedCls: '',
		store: 'Circle',
		disableSelection : true,
		itemTpl: new Ext.XTemplate(
			'<div class="circle-row" data-id="{id}">',
			'<img class="avatar" <tpl if="avatar">src="{[this.getAvatar(values.avatar)]}"</tpl>/>',
			'<div class="info">',
			'<tpl if="feed_type==0">',
				'<div class="action-title"><span class="uname" uid="{uid}">{nick:htmlEncode}</span><span class="action">发表了一条消息</span></div>',
				'<p>{content:htmlEncode}</p>',
			'<tpl elseif="feed_type==1">',
				'<div class="action-title"><span class="uname" uid="{uid}">{nick:htmlEncode}</span><span class="action">发表了一条晒单</span></div>',
				'<tpl if="content"><p>{content:htmlEncode}</p></tpl>',
				'<div class="pic-list">',
				'<tpl for="json_data.pic_list"><img src="{[this.getPic(values)]}"/></tpl>',
				'</div>',
				'<div class="card" dataType="item">',
					'<img src="{[this.getCover(values.json_data.pic_cover)]}"/>',
					'<span>{json_data.title:htmlEncode}</span>',
				'</div>',
			'<tpl elseif="feed_type==2">',
				'<div class="action-title"><span class="uname" uid="{uid}">{nick:htmlEncode}</span><span class="action">拍下了一个宝贝</span></div>',
				'<p>我刚刚购买了{json_data.title:htmlEncode}</p>',
				'<div class="card" dataType="item">',
					'<img src="{[this.getCover(values.json_data.pic_cover)]}"/>',
					'<span>{json_data.title:htmlEncode}</span>',
				'</div>',
			'</tpl>',
			'<div class="flex circle-time"><span class="time">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></span>',
			'<tpl if="this.isLogin()">',
				'<tpl if="this.hasZan(zan)">',
				'<span class="cancel-zan-btn"><i class="icon-up"></i>取消</span>',
				'<tpl else>',
				'<span class="zan-btn"><i class="icon-up"></i>赞</span>',
				'</tpl>',
				'<span class="reply-btn"><i class="icon-comment"></i>回复</span>',
			'</tpl>',
			'</div>',
			'<tpl if="zan">',
	            '<div class="zan"><i class="icon-up"></i>',
	            	'<tpl for="zan">',
	            	'{[xindex > 1 ? "," : ""]}<span class="uname" uid="{uid}">{nick:htmlEncode}</span>',
	            	'</tpl>',
	            '</div>',
            '</tpl>',
			'<tpl if="replies">',
	            '<div class="reply<tpl if="zan"> bt</tpl>">',
	            	'<tpl for="replies">',
	            	'<div class="reply-row" uid="{uid}" rid="{id}" nick="{nick:htmlEncode}">',
	            	'<span class="uname" uid="{uid}">{nick:htmlEncode}</span><tpl if="to_nick">回复<span class="uname" uid="{to_uid}">{to_nick:htmlEncode}</span></tpl>：{content:htmlEncode}</div>',
	            	'</tpl>',
	            '</div>',
            '</tpl>',
			'</div>',
			{
				isLogin: function(){
					return !!WeiQuPai.Cache.get('currentUser');
				},
				isSelf: function(uid){
					var user = WeiQuPai.Cache.get('currentUser');
					if(!user) return false;
					return user.id == uid;
				},
				hasZan: function(zan){
					if(!zan) return false;
					var user = WeiQuPai.Cache.get('currentUser');
					if(!user) return false;
					for(var i=0;i<zan.length; i++){
						if(zan[i].uid == user.id) return true;
					}
					return false;
				},
				getAvatar: function(avatar){
            		return WeiQuPai.Util.getImagePath(avatar, '140');
            	},
				getCover: function(cover){
            		return WeiQuPai.Util.getImagePath(cover, '290');
            	},
            	getPic: function(pic){
            		return WeiQuPai.Util.getImagePath(pic, '40');
            	}
			}
		),
		items: [
			{
                xtype: 'titlebar',
                title: '拍圈',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'banner',
				scrollDock: 'top'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		this.setForceReload(true);
		this.loadData(true);
		this.on('activate', this.onActivate, this);
        this.on('hide', this.onHide, this);
		this.handleItemTap();
		/*
		var btn = {
			xtype: 'button',
			text: '发表',
			action: 'publishPost'
		};
		this.down('titlebar').add(btn);
		*/
		this.replyForm = WeiQuPai.Util.createOverlay('WeiQuPai.view.CircleReply', {height: 48, showAnimation: false, hideAnimation: false});
		this.postForm = WeiQuPai.Util.createOverlay('WeiQuPai.view.CirclePost', {height: 48, showAnimation: false, hideAnimation: false});
	},

	onActivate: function(){
		this.loadData();
		WeiQuPai.Notify.clearNotify([WeiQuPai.Notify.MSG_CIRCLE, WeiQuPai.Notify.MSG_CIRCLE_REPLY, WeiQuPai.Notify.MSG_CIRCLE_ZAN]);
	},

	loadData: function(firstLoad){
		//除了第一次每次都重刷广告
		firstLoad !== true && this.down('banner').updateBanner();
		//强制刷新只做一次
		if(this.getForceReload()){
			this.getStore().removeAll();
			this.setForceReload(false);
			var user = WeiQuPai.Cache.get('currentUser');
			this.getStore().getProxy().setExtraParam('token', user && user.token || null);
			this.setLoadingText(null);
			this.getStore().load();
		}
	},

    onHide: function(){
        this.down('banner').stopTimer();
    },

    handleItemTap: function(){
		if(Ext.os.is.ios){
			this.onBefore('itemtap', function(list, index, dataItem, record, e){
				this.bindEvent(index, record, e);
			});
		}else{
			var me = this;
			this.element.dom.addEventListener('click', function(e){
				var row = Ext.fly(e.target).up('.circle-row');
				if(!row) return;
				var id = row.getAttribute('data-id');
				var index = me.getStore().indexOfId(id);
				var record = me.getStore().getAt(index);
				me.bindEvent(index, record, e);
			});
		}
	},

	bindEvent: function(index, record, e){
		var me = this;
		var user = WeiQuPai.Cache.get('currentUser');
		if(e.target.className == 'avatar'){
			me.fireEvent('avatartap', me, index, record);
			return false;
		}
		if(e.target.className == 'uname'){
			var uid = e.target.getAttribute('uid');
			me.fireEvent('usertap', me, index, record, uid);
			return false;
		}

		//卡片点击
		var card = Ext.get(e.target).up('.card');
		if(card){
			me.fireEvent('cardtap', me, index, record, card.getAttribute('dataType'));
			return false;
		}

		//下面的事件都是登录后才会触发的
		if(!user) return false;

		if(e.target.className == 'delete-post-btn'){
			me.fireEvent('deletepost', me, index, record);
			return false;
		}
		if(e.target.className == 'zan-btn' || e.target.parentNode.className == 'zan-btn'){
			me.fireEvent('zan', me, index, record);
			return false;
		}
		if(e.target.className == 'cancel-zan-btn' || e.target.parentNode.className == 'cancel-zan-btn'){
			me.fireEvent('cancelzan', me, index, record);
			return false;
		}
		if(e.target.className == 'reply-btn' || e.target.parentNode.className == 'reply-btn'){
			me.fireEvent('replytap', me, index, record, 0, null);
			return false;
		}
		if(e.target.className == 'reply-row'){
			var toUid = e.target.getAttribute('uid');
			//删除自己的回复事件
			if(toUid == user.id){
				me.fireEvent('deletereply', me, index, record, e.target.getAttribute('rid'));
				return false;
			}
			//回复事件
			var toUser = e.target.getAttribute('nick');
			me.fireEvent('replytap', me, index, record, toUid, toUser);
			return false;
		}
	}
});
