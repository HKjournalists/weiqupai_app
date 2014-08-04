Ext.define('WeiQuPai.controller.Myfollow', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            myfollow: 'myfollow'
        },
        control: {
            myfollow: {
                itemtap: 'showDetail',
            },

        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        var uid = record.get('id');
        var detailView = Ext.create('WeiQuPai.view.ShowUser', {
            uid: uid
        });
        console.log(uid);
        WeiQuPai.navigator.push(detailView);
    }

});