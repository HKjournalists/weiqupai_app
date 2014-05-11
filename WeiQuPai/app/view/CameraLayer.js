Ext.define('WeiQuPai.view.CameraLayer', {
	extend: 'Ext.Container',
	requires: ['Ext.device.Camera'],
	xtype: 'cameralayer',
	config: {
		picWidth: 140,
		picHeight: 140,	
		callback: null,
		
		cls: 'camera-layer',
		items: [
			{
				xtype: 'button', 
				action: 'camera',
				text: '拍照',
				cls: 'w-button w-margin',
			},
			{
				xtype: 'button', 
				action: 'album',
				text: '从手机相册选择',
				cls: 'w-button w-margin',
			},
			{
				xtype: 'button', 
				action: 'cancel',
				text: '取消',
				cls: 'w-button w-margin',
			}
		]
	},

	initialize: function(){
		this.on('show', WeiQuPai.Util.saveLastView, this);
	}
});
