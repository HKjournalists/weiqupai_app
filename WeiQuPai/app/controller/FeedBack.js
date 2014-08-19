Ext.define('WeiQuPai.controller.FeedBack', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'feedback',
            pubBtn: 'feedback button[action=feedsubmit]',
            feedBackCamera: 'button[action=feedBackCamera]',
        },
        control: {
            pubBtn: {
                tap: 'doPublish'
            },
            feedBackCamera: {
                tap: 'showCameraLayer'
            },
        }
    },

    doPublish: function() {
        var view = this.getPageView();
        var content = view.down('textareafield').getValue().trim();
        if (content.length == 0) {
            return false;
        }
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/feedback';
        var user = WeiQuPai.Cache.get('currentUser');
        var data = {};
        data.uid = user && user.id || 0;
        data.picList = view.getPicList().join("|");
        data.content = content;
        WeiQuPai.Util.post(url, data, function(rsp) {
            view.down('textareafield').reset();
            var imgList = view.down('#cameraArea').query('img');
            for (var i = 0; i < imgList.length; i++) {
                view.down('#cameraArea').remove(imgList[i]);
            }
            view.setPicList([]);
            WeiQuPai.Util.toast('您的意见已提交，感谢您的反馈');
        });
    },

    showCameraLayer: function() {
        var self = this;
        WeiQuPai.Util.showCameraLayer(150, 150, true, function(url) {
            self.addPhoto(url);
        });
    },

    addPhoto: function(url) {
        var picList = this.getPageView().getPicList();
        var cameraArea = this.getPageView().down('#cameraArea');
        picList.push(url);
        var img = Ext.create('Ext.Img');
        img.dataIndex = picList.length - 1;
        img.setSrc(WeiQuPai.Util.getImagePath(url, 150));
        img.setCls('photo');
        img.on('tap', this.showDeleteLayer, this);
        cameraArea.insert(cameraArea.getItems().length - 1, img);
    },

    showDeleteLayer: function(img) {
        var deleteLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.DeleteButtonLayer');
        var view = this.getPageView();
        deleteLayer.setDeleteAction(function() {
            view.getPicList().splice(img.dataIndex, 1);
            view.down('#cameraArea').remove(img);
        });
        deleteLayer.show();
    }
});