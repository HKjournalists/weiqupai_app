Ext.define('vqp.view.Bar', {
    extend: 'Ext.DataView',
    xtype: 'Bar',
    config: {
        cls: 'bar bg_ef',
        store: 'Bar',
        scrollable: null,
        itemTpl: new Ext.XTemplate(
            '<div class="bar_banner">',
            '<input type="button" class="btn"></div>',
            '<div class="clear"></div>',
            '<img src="{img_url}"  class="barimg" />',
            '<input type="button" class="bar_icon"></div>',
            '<div class="barper">',
            '<div class="top"><div class="left">每场血战时限：10小时</div><div class="right"></div><div class="clear"></div></div>',
            '<div class="bottom"><ul><tpl for="person"><li><img src="{url}" width="30" height="30" />{price}</li></tpl><div class="clear"></div></ul></div>',
            '</div>',
            '</div>'

        ),
        items: [{
            xtype: 'titlebar',
            title: '血战到底',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                text: '&nbsp;&nbsp;'
            }]
        }, {
            xtype: 'bottombar',
            cls: 'bottombar'
        }]
    }
})