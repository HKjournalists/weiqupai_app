Ext.define('WeiQuPai.view.DeliveryTimeList', {
	extend: 'Ext.Container',
	xtype: 'deliverytimelist',
	config:{
        layout: 'fit',
        items: [
            {
                xtype: 'list',
                itemTpl: '{title}',
                data: [
                    {
                        title: '周一到周五工作日',
                        id: 1
                    },
                    {
                        title: '周六周日双休日',
                        id: 2
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
