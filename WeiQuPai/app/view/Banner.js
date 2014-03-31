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
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
		this.removeAll(true);
		for(var i=0; i<records.length; i++){
			var img = Ext.create('Ext.Img', {
				src: WeiQuPai.Config.host + records[i].get('pic_url'),
				cls: 'banner-item'
			});
			this.add(img);
		}
		var self = this;
		this.timer = setInterval(function(){
			if(self.getActiveIndex() == self.getMaxItemIndex()){
				self.setActiveItem(0);
				return;
			}
			self.next();
		}, 5000);
	}
});
