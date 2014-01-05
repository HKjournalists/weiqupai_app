Ext.define('WeiQuPai.view.ShipmentList', {
	extend: 'Ext.Container',
	xtype: 'shipmentlist',
	config:{
        layout: 'fit',
        items: [
            {
                xtype: 'list',
                itemTpl: '{title}',
                data: [
                    {
                        title: '顺风快递',
                        id: 'shunfeng'
                    },
                    {
                        title: '圆通快递',
                        id: 'yuantong'
                    },
                    {
                        title: '运通快递',
                        id: 'yuntong'
                    },
                    {
                        title: 'EMS',
                        id: 'ems'
                    }
                ]
            }
        ]
	}
});
