Ext.define('WeiQuPai.view.Banner', {
	extend: 'Ext.carousel.Carousel',
	xtype: 'banner',
	config: {
		direction: 'horizontal',
		cls: 'banner',
		directionLock: true
	},
	initialize : function(){
		var store = Ext.getStore('Ad');
		store.load(this.initData, this);
	},

	initData: function(records, operation, success){
		console.log(records);return;
		/*
		data = records.getData();
		for(var i=0; i<data.length; i++){
			var item = {
				xtype: 'image',
				src: WeiQuPai.Config.host + data[i],
				cls: 'index-ad-item'
			}
			this.add(item);
		}
		var self = this;
		setInterval(function(){
			if(self.getActiveIndex() == self.getMaxItemIndex()){
				self.setActiveItem(0);
				return;
			}
			self.next();
		}, 2000);
*/
	}
});
