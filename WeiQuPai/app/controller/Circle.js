Ext.define('WeiQuPai.controller.Circle', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            circlelist : 'circle',
            main : 'main'
        },
        control: {
           circlelist : {
                itemtap: 'showCircleDetail',
                avatartap: 'showUser'
           }
        }
    },
    
    showCircleDetail: function(list, index, dataItem, record, e){
        var action_class = record.get('action_class');
        var trans_id = record.get('trans_id');
        switch(action_class) {
            //晒单
            case 1:
                target_type = 'showorder';
                break;
            //评论
            case 2:
                target_type = 'itemdetail';
                break;
            //拍下
            case 3:
                target_type = 'itemdetail';
                break;
            //关注
            case 4:
                target_type = 'itemdetail';
                break;
            //公司信息
            case 5:
                target_type = 'companymessage';
                break;
            //网站信息
            case 6:
                target_type = 'sitemessage';
                break;
        }
        var detailView = {
            xtype: target_type,
            trans_id: record.data.trans_id
        };
        this.getMain().push(detailView);
    },

    showUser: function(list, index, record) {
        var feedType = record.get('feed_type');
        var view = Ext.create('WeiQuPai.view.ShowUser', {
            paramId: record.get('uid')        
        });
        this.getMain().push(view);
    }
});
