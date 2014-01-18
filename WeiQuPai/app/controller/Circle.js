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
    
    //called when the Application is launched, remove if not needed
    showCircleDetail: function(list, index, dataItem, record, e){
        var user_class = record.get('user_class');
        if((e.target.className == 'avatar') && (user_class == 'user')){
            this.getCirclelist().fireEvent('avatartap', this, index, record);
            return false;
        };

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
            trans_id: record.data.trans_id,
            //record: record
        };
        //console.log(detailView.trans_id);
        this.getMain().push(detailView);
    },

    showUser: function(list, index, record) {
        this.getMain().getNavigationBar().hide();
        var detailView = {
            xtype: 'showuser',
            trans_id: record.data.trans_id,
            //record: record
        }
        //console.log(detailView.trans_id);
        this.getMain().push(detailView);
    }
});
