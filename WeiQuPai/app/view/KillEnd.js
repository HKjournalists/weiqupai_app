Ext.define('WeiQuPai.view.KillEnd', {
    extend: 'Ext.DataView',
    xtype: 'killend',
    requires: ['WeiQuPai.view.KillHelp', 'WeiQuPai.view.TopKiller', 'WeiQuPai.view.UserAuction'],
    config: {
        cls: 'bar bg_ef',
        store: 'KillEnd',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true
        }, {
            type: 'wlistpaging',
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="clear"></div>',
            '<img src="{pic_url}"  class="barimg" />',
            '<input type="button" class="bar_icon"></div>',
            '<div class="barper">',
            '<div class="top"><div class="left">每场血战时限：{duration}小时</div><div class="right topkiller"></div>',
            '<div class="clear"></div></div>',
            '<div class="bottom"><ul>',
            '<tpl for="auctions">',
            '<li><img src="{[this.getAvatar(values.user.avatar)]}" class="killer_avatar" data-uid="{user.id}"/>',
            '<span class="user_price" data-aid="{id}">￥{curr_price}</spa></li>',
            '</tpl>',
            '<div class="clear"></div></ul></div>',
            '</div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'titlebar',
            title: '血战到底',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            html: '<div class="bar_banner"><input type="button" class="btn"></div>',
            itemId: 'help'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.loadData();

        this.down('#help').on('tap', function() {
            this.fireEvent('help');
        }, this, {
            element: 'element'
        });

        this.on('itemtap', this.bindEvent, this);
    },

    loadData: function() {
        var store = this.getStore();
        //加载数据
        store.load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.topkiller')) {
            this.fireEvent('topkiller', list, index, dataItem, record, e);
            return false;
        }
        if (Ext.get(e.target).findParent('.bar_icon')) {
            this.fireEvent('kill', list, index, dataItem, record, e);
            return false;
        }
        var avatar = Ext.get(e.target).findParent('.killer_avatar');
        if (avatar) {
            var uid = avatar.getAttribute('data-uid');
            this.fireEvent('avatartap', uid);
            return false;
        }
        var price = Ext.get(e.target).findParent('.user_price');
        if (price) {
            var aid = price.getAttribute('data-aid');
            this.fireEvent('pricetap', aid);
            return false;
        }
        this.fireEvent('detail', list, index, dataItem, record, e);
    }
})