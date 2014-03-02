Ext.define('WeiQuPai.view.GenderList', {
    extend: 'Ext.Container',
    xtype: 'genderlist',
    config:{
        layout: 'fit',
        items: [
            {
                xtype: 'list',
                itemTpl: '{title}',
                data: [
                    {
                        title: '男',
                        id: 1 
                    },
                    {
                        title: '女',
                        id: 2
                    }
                ]
            }
        ]
    }
});
