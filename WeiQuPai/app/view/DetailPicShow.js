Ext.define('WeiQuPai.view.DetailPicShow', {
	extend: 'Ext.Panel',
	xtype: 'detailpicshow',
	requires:['Ext.Img', 'Ext.carousel.Carousel'],
	config: {
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
				cls : 'item-detail-pic',
				//indicator: false
			}
		]
	},
	initialize : function(){
		var data = [
			'pic/banner1.jpg',
			'pic/banner2.jpg',
			'pic/banner3.jpg'	
		];
		var com = this.down('carousel');
		for(var i=0; i<data.length; i++){
			var item = {
				xtype: 'image',
				src: WeiQuPai.Config.host + data[i]
			}
			com.add(item);
		}
		/*
		var prev = this.down('button[action=detail-pic-prev]');
		var next = this.down('button[action=detail-pic-next]');
		prev.disable();
		com.on('activeitemchange', function(container, newCard, oldCard){
			//返回的时候也会触发这个事件，加这个防止报错
			if(!container.rendered) return;
            if(this.getActiveIndex() == 0){
                prev.disable();
            }else{
                prev.enable();
            }
            if(this.getActiveIndex() == this.getMaxItemIndex()){
                next.disable();
            }else{
                next.enable();
            }
        });
*/
	}
});
