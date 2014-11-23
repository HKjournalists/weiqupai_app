Ext.define('WeiQuPai.view.KillRanking', {
    extend: 'Ext.Container',
    xtype: 'barperson',
    config: {
        scrollable: true,
        cls: 'bg_ef',
        items: [{
            xtype: 'titlebar',
            title: '杀手榜',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                text: '&nbsp;&nbsp;'
            }]
        }, {
            xtype: 'container',
            id: 'barperson',
            tpl: new Ext.XTemplate(
              '<div class="bar_newC">',
                '<div class="bar_new_list">',
                    '<ul>',
                        '<tpl for=".">',
                        '<li><div class="wang">' +
                                 '<div class="sort">第{id}名</div>' +
                                 '<div class="Photo" width="100%"><img src="{img_url}" width="40"></div>' +
                                 '<div class="name">{name}</div>' +
                                 '<div class="num">{num}人</div>' +
                                 '<div class="award">奖励{text}</div>' +
                                 '<div class="status">({status})</div>' +
                            '</div>' +
                            '</li>',

                        '</tpl>',
                    '</ul>',
                '</div>',
              '</div>'
            )

        }]
    },
    initialize: function() {
        var data = [{
            "id":'1',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'1',
            'num':'5894',
            "text":'300拍券'

        }, {
            "id":'2',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'1',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'3',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'1',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'4',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'进行中',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'5',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'进行中',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'6',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'已结束',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'7',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'已结束',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'8',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'0',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'9',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'已结束',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'10',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'0',
            'num':'5894',
            "text":'300拍券'
        }, {
            "id":'11',
            "img_url": 'resources/images/person.png',
            "name": '昵称',
            "status":'已结束',
            'num':'5894',
            "text":'300拍券'
        }];
       this.down('#barperson').setData(data);
    }
})
