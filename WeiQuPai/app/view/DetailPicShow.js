Ext.define('WeiQuPai.view.DetailPicShow', {
	extend: 'Ext.Panel',
	xtype: 'detailpicshow',
	requires:['Ext.Img', 'Ext.carousel.Carousel', 'WeiQuPai.view.ImageViewer'],
	config: {
		picData: null,
		cls : 'item-detail-pic-container',
		layout: {
			type: 'hbox',
			pack: 'center',
			align: 'center'
		},
		items: [
			{
				xtype: 'carousel',
				flex: 1,
				direction : 'horizontal',
				directionLock: true,
				cls : 'item-detail-pic'
			}
		]
	},

	initialize: function(){
		this.viewer = Ext.Viewport.down('imageviewer');
		if(!this.viewer){
			this.viewer = Ext.create('WeiQuPai.view.ImageViewer');
			Ext.Viewport.add(this.viewer);
		}
	},

	applyPicData: function(data, oldData){
		if(!Ext.isArray(data)){
			return false;
		}
		var com = this.down('carousel');
		for(var i=0; i<data.length; i++){
			var item = Ext.create('Ext.Img', {
				src: WeiQuPai.Config.host + data[i]
			});
			item.on('tap', this.doImageTap, this);
			com.add(item);
		}
		this.viewer.setPicData(data);
		return data;
	}, 

	doImageTap: function(img, e){
		var idx = this.down('carousel').getActiveIndex();
		this.viewer.setActiveItem(idx);
		this.viewer.show();
	}
});
