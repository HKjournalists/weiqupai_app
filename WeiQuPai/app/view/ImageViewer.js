Ext.define('WeiQuPai.view.ImageViewer', {
	extend: 'Ext.carousel.Carousel',
	xtype: 'imageviewer',
	requires:['Ext.Img', 'Ext.carousel.Carousel'],
	config: {
		cls: 'w-imageviewer',
		picData: null,
		fullscreen: true,
		showAnimation: 'fadeIn',
		hideAnimation: 'fadeOut',
		hidden: true,
		style:'background:#000;z-index:1'
	},

	initialize: function(){
		//Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
		this.on('show', WeiQuPai.Util.saveLastView, this);
	},

	applyPicData: function(data){
		//debugger;
		this.removeAll(true);
		if(!Ext.isArray(data)){
			return false;
		}
		for(var i=0; i<data.length; i++){
			var item = Ext.create('Ext.Img', {
				src: WeiQuPai.Config.host + data[i]
			});
			item.on('tap', this.doImageTap, this);
			this.add(item);
		}

	},

	doImageTap: function(img, e){
		this.hide();
	}
});
