var circletpl = new Ext.XTemplate(
        '<div class="circle-row">',
        '<img class="user-icon-small" src="' + WeiQuPai.Config.host + '{user_icon}" />',
        '<div class="circle-info">',
        '<h2>{name}</h2>',
        '{action}',
        '<tpl if="action_class == 1">',
        '<p>',
        '<tpl for="pic">',
        '<img class="pic" src="' + WeiQuPai.Config.host + '{url}" />',
        '</tpl>',
        '</p>',
        '</tpl>',
        '<p>{content}</p>',
        '<p class="time">{time}</p>',
        '</div>'
        );

Ext.define('WeiQuPai.view.CircleList', {
        extend: 'Ext.dataview.List',
        xtype: 'circlelist',
        //requires: ['WeiQuPai.store.Circle'],

        config: {
                emtpyText: '没有可用的商品',
                store: 'Circle',
                disableSelection : true,
                itemTpl: circletpl,
        items: [
                {
                        xtype: 'circlead',
                        scrollDock: 'top',
                        height: '80px'
                }
        ]
        }
});
