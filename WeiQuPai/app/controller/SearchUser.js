Ext.define('WeiQuPai.controller.SearchUser', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            pageView: 'searchuser'
        },
        control: {
            pageView: {
                showdetail: 'showDetail',
                cancelfollow: 'doCancelFollow',
                follow: 'doFollow'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.User.show(record.get('id'));
    },

    doCancelFollow: function(list, index, dataItem, record, e) {
        WeiQuPai.User.cancelFollow(record.get('id'));
    },

    doFollow: function(list, index, dataItem, record, e) {
        WeiQuPai.User.addFollow(record.get('id'), function(){
            WeiQuPai.Util.toast('你成功关注了TA');
        });
    }
});