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
		disclosureItem: true
	},
	titleNode: null,
	detailNode : null,
	disclosureNode : null,

	pressedTimer: null,
	pressDelay:  100,

	beforeInitialize: function(){
		this.titleNode = Ext.create('Ext.Container', {
			cls: 'w-disclosure-title'
		});
		this.detailNode = Ext.create('Ext.Container', {
			cls: 'w-disclosure-content'
		});

		if(this.config.disclosureItem){
			this.disclosureNode = Ext.create('Ext.Container', {
				baseCls: 'w-disclosure',
				docked: 'right'
			});
			//只有需要disclosure的条目才需要touch效果
			this.addListener({	
				element: 'element',
				touchstart: 'doTouchStart',
				touchend: 'doTouchEnd',
				touchmove: 'doTouchEnd'
			});
		}
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
		this.disclosureNode && this.add(this.disclosureNode);
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