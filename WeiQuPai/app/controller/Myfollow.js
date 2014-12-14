Ext.define('WeiQuPai.controller.MyFollow', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            myfollow: 'myfollow'
        },
        control: {
            myfollow: {
                showdetail: 'showDetail',
                cancelfollow: 'doCancelFollow'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        WeiQuPai.User.show(record.get('id'));
    },

    doCancelFollow: function(list, record) {
        WeiQuPai.User.cancelFollow(record.get('id'));
    }
});