Ext.define('WeiQuPai.controller.ShowOrder', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'showorder',
            pubBtn: 'showorder button[action=publish]',
            showOrderCamera: 'button[action=showOrderCamera]',
        },
        control: {
            pubBtn: {
                tap: 'doPublish'
            },
            showOrderCamera: {
                tap: 'showCameraLayer'
            },
        }
    },

    doPublish: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var view = this.getPageView();
        var data = {};
        data.content = view.down('textareafield').getValue();
        data.picList = view.getPicList().join("|");
        data.item_id = view.getRecord().get('item').id;
        data.order_id = view.getRecord().get('id');
        data.pic_cover = view.getRecord().get('item').pic_cover;
        if (data.picList.length == 0) {
            WeiQuPai.Util.toast('还是上传一张照片吧~');
            return;
        }
        var url = WeiQuPai.Util.apiUrl('r=appv2/circle/post');
        WeiQuPai.Util.post(url, data, function(rsp) {
            WeiQuPai.navigator.pop('maincard');
            WeiQuPai.sidebar.activeTabItem('circle');
            WeiQuPai.navigator.down('circle').loadData();

            if(rsp.score){
                WeiQuPai.Util.toast('晒单成功，获得' + rsp.score + '积分');
            }
            WeiQuPai.app.statReport({
                act: 'showorder'
            });
        }, {
            mask: true
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