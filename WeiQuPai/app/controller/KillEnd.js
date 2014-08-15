Ext.define('WeiQuPai.controller.KillEnd', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'killend'
        },
        control: {
            pageView: {
                help: 'showHelp',
                detail: 'showDetail',
                kill: 'createAuction',
                topkiller: 'showTopKiller',
                avatartap: 'showUser',
                pricetap: 'showAuction'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    },

    showAuction: function(aid) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(aid);
        WeiQuPai.navigator.push(view);
    },

    showHelp: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.KillHelp');
        WeiQuPai.navigator.push(view);
    },

    showUser: function(uid) {
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(uid);
        WeiQuPai.navigator.push(view);
    },

    showTopKiller: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.TopKiller');
        view.setPoolId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    //创建拍卖
    createAuction: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var poolId = record.get('id');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/create';
        data = {
            pool_id: poolId,
            token: user.token
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            var view = Ext.create('WeiQuPai.view.UserAuction');
            view.setAuctionId(rsp.id);
            setTimeout(function() {
                WeiQuPai.navigator.push(view);
            }, 0);
            if (!rsp.is_new) {
                return;
            }
            setTimeout(function() {
                WeiQuPai.Util.toast('拍卖创建成功，赶快分享给朋友帮你杀价吧！');
            }, 400);
        }, {
            mask: true
        });
    }

});