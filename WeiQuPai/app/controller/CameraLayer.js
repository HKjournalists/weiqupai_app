Ext.define('WeiQuPai.controller.CameraLayer', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            camera: 'cameralayer button[action=camera]',
            album: 'cameralayer button[action=album]',
            cancel: 'cameralayer button[action=cancel]',
            cameraLayer: 'cameralayer'
        },
        control: {
        	camera: {tap: 'capture'},
        	album: {tap: 'capture'},
        	cancel: {tap: 'cancel'}
        }
    },

    capture: function(btn){
        this.getCameraLayer().hide();
		Ext.device.Camera.capture({
            success: this.onCaptureSuccess,
            failure: this.onCaptureFailure,
            scope: this,
            quality : 60,
            encoding: 'jpg',
            source: btn.config.action,
            destination: 'data',
            width: this.getCameraLayer().getPicWidth(),
            height:this.getCameraLayer().getPicHeight()
        });
    },

    cancel: function(btn){
    	this.getCameraLayer().hide();
    },

    //拍成功后上传图片到server
    onCaptureSuccess: function(imgData){
        var user = WeiQuPai.Cache.get('currentUser');
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/upload&token=' + user.token,
            method: 'post',
            params: {
                imgData : imgData
            },
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
                if(rsp.code && rsp.code > 0){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                var callback = this.getCameraLayer().getCallback();
                callback && callback(rsp.url);
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.Alert(null, '图片上传失败，请重试');
            },
            scope: this
        });
    },

    onCaptureFailure: function(){
        return true;
    }
});
