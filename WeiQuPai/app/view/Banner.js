Ext.define('WeiQuPai.view.Banner', {
	extend: 'Ext.carousel.Carousel',
	xtype: 'banner',
	config: {
		paramType: 'index',
		direction: 'horizontal',
		cls: 'banner',
		directionLock: true
	},
	timer: null,

	updateBanner : function(){
		var store = Ext.getStore('Banner');
		store.removeAll();
		store.getProxy().setExtraParam('type', this.getParamType());
		store.load(this.initData, this);
	},

	initData: function(records, operation, success){
		if(!success || records.length == 0){
			this.hide();
			return;
		}
		this.show();
		this.stopTimer();
		this.removeAll(true);
		for(var i=0; i<records.length; i++){
			var img = Ext.create('Ext.Img', {
				src: WeiQuPai.Config.host + records[i].get('pic_url'),
				cls: 'banner-item',
				data: records[i].data,
			});
			img.on('tap', this.doImageTap, this);
			this.add(img);
		}
		this.setActiveItem(0);
		this.startTimer();
	},

	startTimer: function(){
		var self = this;
		this.timer = setInterval(function(){
			if(self.getActiveIndex() == self.getMaxItemIndex()){
				self.setActiveItem(0);
				return;
			}
			self.next();
		}, 5000);
	},

	stopTimer: function(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
	},

	doImageTap: function(img){
		var data = img.getData();
		if(!data.link) return;
		if(data.type == 1){
			window.open(data.link, '_system');
		}else{
			var view = Ext.create('WeiQuPai.view.WebPage');
			view.setHref(data.link);
			view.setTitle(data.title || '微趣拍');
			Ext.Viewport.down('main').push(view);
		}
	}
});
