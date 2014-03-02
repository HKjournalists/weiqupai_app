Ext.define('WeiQuPai.controller.Camera', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            camera: 'button[action=camera]',
            album: 'button[action=album]',
            cancel: 'button[action=cancel]',
            cameraLayer: 'cameralayer'
        },
        control: {
        	camera: {tap: 'capture'},
        	album: {tap: 'album'},
        	cancel: {tap: 'cancel'}
        }
    },

    capture: function(btn){
		Ext.device.Camera.capture({
            success: this.onCaptureSuccess,
            scope: this,
            quality : 50,
            source: 'camera',
            destination: 'file'
        });
    },

    album: function(btn){
    	Ext.device.Camera.capture({
            success: this.onCaptureSuccess,
            scope: this,
            quality : 50,
            source: 'alubm',
            destination: 'file'
        });
    },

    cancel: function(btn){
    	this.getCameraLayer().hide();
    },

    onCaptureSuccess: function(uri){
    	console.log(uri);
    }
});
