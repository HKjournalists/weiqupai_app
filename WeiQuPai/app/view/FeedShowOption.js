Ext.define('WeiQuPai.view.FeedShowOption', {
	extend: 'Ext.Container',
	xtype: 'feedshowoption',
	config:{
        layout: 'fit',
        items: [
            {
                xtype: 'list',
                itemTpl: '{title}',
                data: [
                    {
                        title: '所有人',
                        id: '1'
                    },
                    {
                        title: '好友',
                        id: '2'
                    },
                    {
                        title: '不公开',
                        id: '3'
                    }
                ]
            }
        ]
	},

    show: function(){
        WeiQuPai.Util.slideUp.call(this);
    },

    hide: function(){
        WeiQuPai.Util.slideDown.call(this);
    },
});
