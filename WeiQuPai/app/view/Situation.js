Ext.define('vqp.view.Situation', {
    extend: 'Ext.DataView',
    xtype: 'Situation',
    config: {
        cls: 'bg_ef detail situation',
        store: 'Situation',
        disableSelection: true,
        scrollable: true,
        itemTpl: new Ext.XTemplate(
            '<tpl for="product">',
            '<div class="bar_new">',
              '<img src="{pro_img}" width="100" >',
              '<div class="text"><ul>' +
                '<li class="text">{title}</li>' +
                  '<li><span class="floatleft" style="width:100px;">剩余时间:{surplus}08:11:34</span><br></li>' +
                  '<li class="red"><span class="floatleft">当前价格:{oprice}</span><span class="floatright">底价:&nbsp;&nbsp;{botprice}</span><br></li>' +
                  '<li><span class="floatleft"><input type="button" class="status" value="立刻下单" /></span><span class="floatleft"><input type="button" class="daoju" value="使用道具" /></span></li>',
                  '</ul></div>',
            '</div>',
            '</tpl>',
            '<div class="color_e7 bar_see">查看商品图文详情&nbsp;&nbsp;></div>',
            '<div class="friend">',
            '<div class="situcon">',
            '<div class="top">' +
              '<div class="bar_dest">分享链接获得更多战友</div>',
             '</div>',
            '<tpl for="friend">',
            '<div class="bottom">',
            '<ul>',
            '<li>{title}</li>',
            '<li><img src="{pro_img}" width="40" /></li>',
            '<li>{oprice}元      {time}</li>',

            '</ul>',
            '</div>',
            '</tpl>',
            '</div>',
            '</div>'

        ),
        items: [{
            xtype: 'titlebar',
            title: '我的战况',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                text: '&nbsp;&nbsp;'
            }]
        }]
    }
})