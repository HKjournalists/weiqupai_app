Ext.define('WeiQuPai.view.Banner', {
	extend: 'Ext.carousel.Carousel',
	xtype: 'banner',
	config: {
		paramType: 'index',
		direction: 'horizontal',
		cls: 'banner',
		directionLock: true
	},
	initialize : function(){
		var store = Ext.getStore('Banner');
		store.getProxy().setExtraParam('type', this.getParamType());
		store.load(this.initData, this);
	},

	initData: function(records, operation, success){
		if(!success || records.length == 0){
			this.hide();
			return;
		}
		for(var i=0; i<records.length; i++){
			var img = Ext.create('Ext.Img', {
				src: WeiQuPai.Config.host + records[i].get('pic_url'),
				cls: 'banner-item'
			});
			this.add(img);
		}
		var self = this;
		setInterval(function(){
			if(self.getActiveIndex() == self.getMaxItemIndex()){
				self.setActiveItem(0);
				return;
			}
			self.next();
		}, 2000);
	}
});
