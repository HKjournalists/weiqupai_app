Ext.define('WeiQuPai.view.DetailPicShow', {
	extend: 'Ext.Panel',
	xtype: 'detailpicshow',
	requires:['Ext.Img', 'Ext.carousel.Carousel'],
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

	applyPicData: function(data, oldData){
		if(!Ext.isArray(data)){
			return false;
		}
		var com = this.down('carousel');
		for(var i=0; i<data.length; i++){
			var item = {
				xtype: 'image',
				src: WeiQuPai.Config.host + data[i]
			}
			com.add(item);
		}
	}
});
