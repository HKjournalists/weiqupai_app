Ext.define('WeiQuPai.view.SplashScreen', {
	extend: 'Ext.Container',
	xtype: 'splashscreen',
	requires:['Ext.Img'],
	config: {
		cls: 'w-imageviewer',
		fullscreen: true,
		hideAnimation: 'fadeOut',
		showAnimation: 'fadeIn',
		picData: null,
		hidden: true
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
		if(!data.link) return;
		var data = this.getPicData();
		var view = Ext.create('WeiQuPai.view.WebPage');
		var href = data.link;
		var user = WeiQuPai.Cache.get('currentUser');
		if(user) href += (href.indexOf("?") == -1 ? '?' : '&')  + 'token=' + user.token;
		view.setHref(href);
		view.setTitle(data.title || '微趣拍');
		Ext.Viewport.down('main').push(view);
	}
});
