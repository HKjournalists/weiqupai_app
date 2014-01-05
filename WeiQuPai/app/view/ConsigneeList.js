Ext.define('WeiQuPai.view.ConsigneeList', {
    extend: 'Ext.dataview.List',
    xtype: 'consigneelist',
    config:{
        cls: 'w-list-consignee',
        title: '收货信息',
        itemTpl: new Ext.XTemplate(
            '<div class="info">',
            '<p>收货人：{name}</p>',
            '<p>电话：{mobile}</p>',
            '<p>地址：{province}{city}{address}</p>',
            '<p>邮编：{zip}</p>',
            '</div>'
        ),
        data: [
            {
                id: 1,
                province: '北京',
                city: '海淀区',
                address: '知春里小区23号楼',
                name: '石延操',
                mobile: '13522531922',
                email: 'iceshi@qq.com',
                zip: '100010'
            },
            {
                id: 2,
                province: '辽宁',
                city: '沈阳',
                address: '知春里小区23号楼',
                name: '崔丽',
                mobile: '15120003859',
                email: 'iceshi@qq.com',
                zip: '100010'
            },
        ],
        items: [
            {
                xtype: 'bottombar'
            }
        ]
    }
});
