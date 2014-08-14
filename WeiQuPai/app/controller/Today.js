Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'today',
            specialView: 'specialsale',
            killend: 'today button[action=killend]',
            notice: 'today button[action=notice]',
            circle: 'today button[action=circle]',
            discount: 'today button[action=discount]'
        },
        control: {
            pageView: {
                showdetail: 'showDetail',
                liketap: 'doLike',
                unliketap: 'doUnlike'
            },
            specialView: {
                showdetail: 'showDetail',
                liketap: 'doLike',
                unliketap: 'doUnlike'
            },
            specialBtn: {
                tap: 'showSpecial'
            },
            killend: {
                tap: 'showKillEnd'
            },
            notice: {
                tap: 'noticelist'
            },
            circle: {
                tap: 'goCircle'
            },
            discount: {
                tap: 'goDiscount'
            }
        }
    },
    noticelist: function() {
        var detailView = Ext.create('WeiQuPai.view.Notice');
        WeiQuPai.navigator.push(detailView);
    },

    showKillEnd: function() {
        var detailView = Ext.create('WeiQuPai.view.KillEnd');
        WeiQuPai.navigator.push(detailView);
    },

    goCircle: function() {
        WeiQuPai.sidebar.activeTabItem('circle');
    },

    goDiscount: function() {
        var view = Ext.create('WeiQuPai.view.Discount');
        WeiQuPai.navigator.push(view);
    },

    doLike: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = parseInt(record.get('item_id'));
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike&item_id=' + itemId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('like', itemId);
            var stat = record.get('item_stat');
            stat.like_num++;
            record.set('item_stat', stat);
            WeiQuPai.Util.heartBeat(dataItem.down('.heart'));
        });
    },

    doUnlike: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = parseInt(record.get('item_id'));
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike/cancel&item_id=' + itemId + '&token=' + user.token;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('like', itemId);
            var stat = record.get('item_stat');
            if (stat.like_num > 0) stat.like_num--;
            record.set('item_stat', stat);
        });
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
});