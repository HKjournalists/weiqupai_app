Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'today',
        },
        control: {
            pageView: {
                itemtap: 'showDetail',
                liketap: 'doLike',
                disliketap: 'doDislike'
            },
            specialBtn: {
                tap: 'showSpecial'
            }
        }
    },

    doLike: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = record.get('id');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike&token=' + user.token,
            method: 'get',
            params: {
                item_id: itemId
            },
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
            }
        });
    },

    doDislike: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = record.get('id');
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/itemDislike&token=' + user.token,
            method: 'get',
            params: {
                item_id: itemId
            },
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                if (!WeiQuPai.Util.invalidToken(rsp)) return false;
                if (rsp.code > 0) {
                    WeiQuPai.Util.toast(rsp.msg);
                    return;
                }
            }
        });
    },

    showDetail: function(list, index, dataItem, record, e) {
        var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam(record.data);
        this.getMain().push(detailView);
    },

    //切换到专场tab
    showSpecial: function() {
        var view = Ext.create('WeiQuPai.view.SpecialSale');
        view.setParam({
            id: 3,
            title: '世界杯专场'
        });
        this.getMain().push(view);
    },

});