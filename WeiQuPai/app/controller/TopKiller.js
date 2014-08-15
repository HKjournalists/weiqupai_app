Ext.define('WeiQuPai.controller.TopKiller', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'topkiller',
        },
        control: {
            pageView: {
                help: 'doHelp',
                avatartap: 'showUser',
                iteminfo: 'showItem',
                detail: 'showDetail',
            }
        }
    },

    showItem: function() {
        var data = this.getPageView().down('#itemInfo').getData();
        WeiQuPai.Util.goItemView(data.item_id);
    },

    showUser: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(record.get('user').id);
        WeiQuPai.navigator.push(view);
    },

    showDetail: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    //帮拍
    doHelp: function(list, index, dataItem, record, e) {
        var auctionId = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/help&id=' + auctionId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.toast('您成功帮忙减掉了' + rsp.discount + '元');
            Ext.get(dataItem).down('.killerbar').setHtml('￥' + rsp.curr_price);
            //到的时候隐藏帮忙按钮
            if (rsp.curr_price == 0) {
                Ext.get(dataItem).down('.btn').addCls('hidden');
            }
            var oldProgress = record.get('progress');
            var anim = Ext.create('Ext.Anim', {
                autoClear: false,
                from: {
                    width: oldProgress + '%',
                },
                to: {
                    width: rsp.progress + '%'
                },
                duration: 400
            });
            setTimeout(function() {
                var el = Ext.get(dataItem).down('.progress-bar');
                anim.run(el);
            }, 200);
        });
    },

});