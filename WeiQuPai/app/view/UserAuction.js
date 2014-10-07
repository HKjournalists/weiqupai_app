Ext.define('WeiQuPai.view.UserAuction', {
    extend: 'Ext.DataView',
    xtype: 'userauction',
    requires: ['WeiQuPai.view.UserAuctionComment'],
    config: {
        cls: 'bg_ef detail situation',
        store: 'UserAuctionHelper',
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
            refreshFn: 'fetchLastest',
            scrollerAutoRefresh: true
        }, {
            type: 'wlistpaging',
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="helper">',
            '<div class="helper_nick">{user.nick}</div>',
            '<img src="{[this.getAvatar(values.user.avatar)]}" width="40" class="helper_avatar"/>',
            '<div class="helper_discount">{discount}元<span class="help_time">{ctime}</span></div>',
            '<div class="clear"></div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '实时战况',
            docked: 'top',
            cls: 'titlebar1',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        },{
            xtype: 'container',
            itemId: 'auctionInfo',
            tpl: new Ext.XTemplate(
                '<div class="bar_new">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" width="100"/>',
                '<div class="text"><ul>',
                  '<li class="text">{item.title}</li>',
                  '<li>{[this.getLeftTime(values)]}</li>',
                  '<li class="red"><span class="floatleft">当前价格：{curr_price}</span>',
                     '<span class="floatright">底价：{reserve_price}</span><br></li>',
                  '<tpl if="this.isSelf(values)">',
                  '<li><span class="floatleft"><input type="button" class="status orderBtn" value="立刻下单" /></span>',
                  '<span class="floatleft"><input type="button" class="daoju" value="使用道具" /></span></li>',
                  '</tpl>',
                '</ul></div>',
                '</div>', {
                    isSelf: function(values){
                        var user = WeiQuPai.Cache.get('currentUser');
                        return user && user.id == values.uid;
                    },
                    getCover: function(pic_cover) {
                        return WeiQuPai.Util.getImagePath(pic_cover, 200);
                    },
                    getLeftTime: function(values) {
                        if (values.left_time) {
                            return '剩余时间：' + values.left_time;
                        }
                        var text = ['', '进行中', '等待购买', '已成交', '已结束'];
                        return text[values.status];
                    }
                }
            )
        },{
            xtype: 'container',
            cls: 'w-tip',
            itemId: 'tip',
            hidden: true,
            hideAnimation: {
                type: 'fadeOut'
            }
        },{
            xtype: 'disclosureitem',
            title: '查看商品图文详情',
            itemId: 'showItemBtn',
        }, {
            xtype: 'container',
            html: '<div class="share_container"><div class="bar_dest">分享链接获得更多战友</div><div class="share_btn"></div></div>',
            itemId: 'shareContainer'
        }],

        auctionId: null,
        auctionData: null
    },

    initialize: function() {
        this.callParent(arguments);

        this.on('tap', this.bindContainerEvent, this, {
            element: 'element'
        });

        this.down('#showItemBtn').on('tap', function(){
            this.fireEvent('showitem', this);
        }, this);

        this.on('itemtap', this.bindEvent, this);

        this.showTips();
    },


    showTips: function() {
        if (!WeiQuPai.app.firstLaunch) return;
        setTimeout(function() {
            var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.KillTip');
            view.show();
        }, 500);
    },

    updateAuctionId: function(id) {
        this.loadData();
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            setTimeout(function() {
                me.setState('loaded');
                me.snapBack();
            }, 100);
        });
    },

    hideTip: function() {
        var me = this;
        setTimeout(function() {
            me && me.down('#tip') && me.down('#tip').hide();
        }, 30000);
    },

    loadData: function(callback) {
        var id = this.getAuctionId();
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/view&id=' + id;
        if (user) {
            url += '&token=' + user.token;
        }
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            me.setAuctionData(rsp);
            me.down('#auctionInfo').setData(rsp);
            //有提示信息则显示
            if(rsp.tip_msg){
                setTimeout(function(){
                    me.down('#tip').setHtml(rsp.tip_msg);
                    me.down('#tip').show('pop');
                    me.hideTip();
                }, 500);
            }
            me.getStore().getProxy().setExtraParam('id', id);
            me.getStore().setData(rsp.helpers);
            me.getStore().currentPage = 1;
            WeiQuPai.Util.resetListPaging(me);
            Ext.isFunction(callback) && callback();

            //上报统计
            var lastView = WeiQuPai.navigator.getPreviousItem();
            if (lastView.isXType('maincard')) {
                lastView = lastView.getActiveItem();
            }
            var from = lastView.getXTypes().split('/').pop();
            var data = {};
            data.from = from;
            data.page = 'useraution';
            data.auction_id = rsp.id;
            data.item_id = rsp.item_id;
            WeiQuPai.app.statReport(data);
        });
    },

    bindContainerEvent: function(e) {
        if (Ext.get(e.target).findParent('.daoju')) {
            this.fireEvent('proptap');
            return false;
        }
        if (Ext.get(e.target).findParent('.orderBtn')) {
            this.fireEvent('ordertap');
            return false;
        }
        if (Ext.get(e.target).findParent('.share_btn')) {
            this.fireEvent('sharetap');
            return false;
        }
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.helper_avatar')) {
            this.fireEvent('avatartap', list, index, dataItem, record, e);
            return false;
        }
    }
})