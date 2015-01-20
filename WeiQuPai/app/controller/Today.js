Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'today',
            specialView: 'specialsale',
            auctionList: 'auctionlist',
            killend: 'today button[action=killend]',
            hot: 'today button[action=hot]',
            luxuries: 'today button[action=luxuries]',
            circle: 'today button[action=circle]',
            discount: 'today button[action=discount]',
            catBtn: 'button[action=category]'
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
            auctionList: {
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
            hot: {
                tap: 'showKillEnd'
            },
            luxuries: {
                tap: 'showLuxuries'
            },
            circle: {
                tap: 'goCircle'
            },
            discount: {
                tap: 'goDiscount'
            },
            catBtn: {
                tap: 'showCategory'
            }
        }
    },
    
    showLuxuries: function() {
        var view = Ext.create('WeiQuPai.view.KillEndChannel');
        view.setTitle('奢侈品频道');
        view.setChannel(2);
        WeiQuPai.navigator.push(view);
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
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemLike&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('item_like', itemId);
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
        var url = WeiQuPai.Util.apiUrl('r=appv2/itemLike/cancel&item_id=' + itemId);
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.delCache('item_like', itemId);
            var stat = record.get('item_stat');
            if (stat.like_num > 0) stat.like_num--;
            record.set('item_stat', stat);
        });
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    },

    showCategory: function() {
        var view = Ext.create('WeiQuPai.view.CategoryWithSearch');
        WeiQuPai.navigator.push(view);
    }
});