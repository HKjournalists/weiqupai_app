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
	},

	applyPicData: function(data, oldData){
		if(!Ext.isArray(data)){
			return false;
		}
		var com = this.down('carousel');
		for(var i=0; i<data.length; i++){
			var item = Ext.create('Ext.Img', {
				src: WeiQuPai.Util.getImagePath(data[i], '290')
			});
			item.on('tap', this.doImageTap, this);
			com.add(item);
		}
		var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
		viewer.setPicData(data);
		return data;
	}, 

	doImageTap: function(img, e){
		var idx = this.down('carousel').getActiveIndex();
		var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ImageViewer');
		viewer.setActiveItem(idx);
		viewer.show();
	}
});
