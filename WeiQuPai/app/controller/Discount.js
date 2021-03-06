Ext.define('WeiQuPai.controller.Discount', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'discountnormal',
            getBtn: 'discountdetail button[action=getit]'
        },
        control: {
            pageView: {
                showdetail: 'doShowDetail'
            },
            getBtn: {
                tap: 'getDiscount'
            }
        }
    },

    doShowDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.DiscountDetail');
        view.setDiscountId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    getDiscount: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var data = WeiQuPai.navigator.getActiveItem().getRecord().data;
        var layer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        layer.down('button[action=weibo]').setDisabled(false);
        var shareData = {
            title: data.share_text || data.title,
            thumb: WeiQuPai.Util.getImagePath(data.pic_url),
            url: 'http://www.vqupai.com/mm/?r=discount/show&id=' + data.id,
            stat: {
                type: 'discount',
                id: data.id
            }
        }
        layer.setShareData(shareData);
        layer.setShareCallback(function() {
            layer.setShareCallback(null);
            var discountId = data.id;
            var url = WeiQuPai.Util.apiUrl('r=appv2/discount/get&id=' + discountId);
            WeiQuPai.Util.get(url, function(rsp) {
                var scoreInfo =  rsp.score ? ('，同时获得' + rsp.score + '积分') : '';
                WeiQuPai.Util.toast('恭喜您成功领取了一个优惠' + scoreInfo);
            });
        });
        layer.show();
    }
});