Ext.define('WeiQuPai.view.SplashScreen', {
	extend: 'Ext.Container',
	xtype: 'splashscreen',
	requires:['Ext.Img'],
	config: {
		cls: 'w-imageviewer',
		fullscreen: true,
		hideAnimation: 'fadeOut',
		picData: null,
	},

	initialize: function(){
		//Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
	},

	applyPicData: function(data){
		this.setStyle('z-index:1;background:' +  data.bg || '#e4eee6');
		var img = Ext.create('Ext.Img', { width:'100%', height: '100%', src : data.pic_url});
		this.add(img);
		img.on('tap', this.doImageTap, this);
		return data;
	},

	doImageTap: function(){
		this.hide(false);
        Ext.Viewport.setActiveItem('main');
		var data = this.getPicData();
		var view = Ext.create('WeiQuPai.view.WebPage');
		view.setHref(data.link);
		view.setTitle(data.title || '微趣拍');
		Ext.Viewport.down('main').push(view);
	}
});
