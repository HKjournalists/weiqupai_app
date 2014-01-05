Ext.define("WeiQuPai.view.DisclosureItem", {
	extend: 'Ext.Container',
	xtype: 'disclosureitem',

	config: {
		layout: 'hbox',
		title : '标题',
		contentPosition: 'right',
		content: '',
		titleStyle: 'bold',//[bold, normal]
		cls: 'w-disclosure-item',

		listeners: {
			element: 'element',
			touchstart: 'doTouchStart',
			touchend: 'doTouchEnd',
			touchmove: 'doTouchEnd'
		}
	},
	titleNode: null,
	detailNode : null,
	discloureNode : null,

	pressedTimer: null,
	pressDelay:  100,

	beforeInitialize: function(){
		this.titleNode = Ext.create('Ext.Panel', {
			cls: 'w-disclosure-title'
		});
		this.detailNode = Ext.create('Ext.Panel', {
			cls: 'w-disclosure-content'
		});

		this.discloureNode = Ext.create('Ext.Panel', {
			baseCls: 'w-disclosure',
			docked: 'right'
		});
		if(this.config.contentPosition == 'right'){
			this.setLayout('hbox');
			this.detailNode.setDocked('right');
			this.detailNode.addCls('right');
		}else{
			this.setLayout('vbox');
			this.detailNode.addCls('bottom');
		}
	},

	initialize: function(){
		this.add(this.titleNode);
		//顺序很重要，discolsure一定要先加
		this.add(this.discloureNode);
		this.add(this.detailNode);
		this.relayEvents(this.element, ['tap', 'singletap', 'doubletap', 'swipe', 'taphold'])
	},

	setContent: function(html){
		Ext.isString(html) ? this.detailNode.setHtml(html) : this.detailNode.add(html);
	},

	setTitle: function(title){
		if(this.config.titleStyle == 'bold'){
			title = '<h2>' + title + '</h2>';
		}
		this.titleNode.setHtml(title);
	},

	doTouchStart: function(){
		var me = this;
		this.pressedTimer = Ext.defer(function(){
			me.addCls('w-disclosure-item-pressed');
		}, this.pressDelay);
	},

	doTouchEnd: function(){
		if(this.pressedTimer){
			clearTimeout(this.pressedTimer);
			delete this.pressedTimer;
		}
		this.removeCls('w-disclosure-item-pressed');
	}

});