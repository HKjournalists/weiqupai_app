Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'today',
            yipai: 'today button[action=yipai]'
        },
        control: {
            pageView: {
                itemtap: 'showDetail',
                liketap: 'doLike',
                unliketap: 'doUnlike'
            },
            specialBtn: {
                tap: 'showSpecial'
            },
            yipai: {
                tap: 'yipailist'
            }
        }
    },
    yipailist: function() {
        var detailView = Ext.create('WeiQuPai.view.YiPai');
        //console.log("record+" + record + "e=" + e);
        //detailView.setParam(record);
        WeiQuPai.navigator.push(detailView);
    },
    heartBeat: function(dataItem) {
        var me = this;
        var el = dataItem.down('.heart');
        var outAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'zoom': '1'
            },
            to: {
                'zoom': '1.2'
            },
            duration: 100,
            after: function() {
                inAnim.run(el);
            }
        });
        var inAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'zoom': '1.2'
            },
            to: {
                'zoom': '1'
            },
            duration: 100
        });
        outAnim.run(el);
    },

    doLike: function(list, index, dataItem, record, e) {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var itemId = parseInt(record.get('item_id'));
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/itemLike&item_id=' + itemId + '&token=' + user.token;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            WeiQuPai.Util.setCache('like', itemId);
            var stat = record.get('item_stat');
            stat.like_num++;
            record.set('item_stat', stat);
            me.heartBeat(dataItem);
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