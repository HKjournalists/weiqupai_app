Ext.define('WeiQuPai.controller.Circle', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            circlelist : 'circlelist',
            main : 'main'
        },
        control: {
           circlelist : {
                itemtap: 'showCircleDetail',
                avatartap: 'showUser'
           }
        }
    },
    
    //called when the Application is launched, remove if not needed
    showCircleDetail: function(list, index, dataItem, record, e){
        console.log('showCircleDetail');
        var action_class = record.get('action_class');
        var ori_id = record.get('ori_id');
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
                target_type = 'showcompany';
                break;
            //网站信息
            case 6:
                target_type = 'showsite';
                break;
        }
        var detailView = {
            xtype: target_type,
            record: record
        };
        this.getMain().push(detailView);
    },

    showUser: function(list, index, record) {
        this.getMain().getNavigationBar().hide();
        console.log('showUser');
        var detailView = {
            xtype: 'showuser',
            record: record
        }
        this.getMain().push(detailView);
    }
});
