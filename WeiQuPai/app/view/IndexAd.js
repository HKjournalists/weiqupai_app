Ext.define('WeiQuPai.view.IndexAd', {
	extend: 'Ext.carousel.Carousel',
	xtype: 'indexad',
	requires:['Ext.Img'],
	config: {
		direction: 'horizontal',
		cls: 'index-ad'
	},
	initialize : function(){
		var data = [
			'pic/banner1.jpg',
			'pic/banner2.jpg',
			'pic/banner3.jpg'	
		];
		for(var i=0; i<data.length; i++){
			var item = {
				xtype: 'image',
				src: 'http://localhost:8080/WeiQuPai/' + data[i],
				cls: 'index-ad-item'
			}
			this.add(item);
		}
		return;
		var self = this;
		var len = data.length;
		setInterval(function(){
			if(self.getActiveIndex() == len - 1){
				self.setActiveItem(0);
				return;
			}
			self.next();
		}, 2000);
	}
});
