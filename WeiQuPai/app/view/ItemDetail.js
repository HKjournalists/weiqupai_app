Ext.define('WeiQuPai.view.ItemDetail', {
    extend: 'Ext.Container',
    xtype: 'itemdetail',
    requires: [
        'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar', 'WeiQuPai.view.DisclosureItem',
        'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Order', 'WeiQuPai.model.Auction',
        'WeiQuPai.view.ShareLayer', 'WeiQuPai.view.Brand', 'WeiQuPai.model.Reserve',
        'WeiQuPai.view.Comment'
    ],
    config: {
        auctionId: null,
        scrollable: true,
        cls: 'detail',
        layout: 'vbox',
        items: [{
            xtype: 'bottombar',
            cls: 'bottombar'
        }, {
            xtype: 'titlebar',
            title: '商品详情',
            cls: 'detail_bar',
            docked: 'top',
            items: [{
                iconCls: 'arrow_left'
            }, {
                align: 'right',
                iconCls: 'refresh'
            }]
        }, {
            xtype: 'container',
            id: 'detailData',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="left">',
                '<div class="priceNew">',
                '{curr_price}',
                '</div>',
                '<div class="price">',
                '<span>',
                '原价￥{oprice}  ',
                '</span>',
                '已售出:{item_stat.sold_num}',
                '</div>',
                '</div>',
                '<div class="detail_map">',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'tabpanel',
            baseCls: 'detailcard',
            flex: 1,
            items: [{
                xtype: 'container',
                title: '商品参数',
                itemId: 'itemDesc',
                tpl: '{description}{description}'
            }, {
                title: '大家评论',
                xtype: 'comment'
            }, {
                title: '图文详情'
            }]
        }]
    },

    refreshTimer: null,
    counterTimer: null,
    //未开始时为还有多少时间开始，拍卖中时为本轮剩余时间
    leftSeconds: 0,

    initialize: function() {
        this.callParent(arguments);

        //this.down('bottombar #buttonContainer').add(commentBtn);
        //this.down('bottombar #buttonContainer').add(paiBtn);
        //this.down('bottombar #buttonContainer').add(shareButton);
        /*
        this.down('#paiBtn').on('tap', function() {
            if (this.getDisabled()) return;
            this.fireEvent('pai');
        }, null, {
            element: 'element'
        });
        */
        //没有评论显示的信息
        this.msgbox = WeiQuPai.Util.msgbox('还没有人评论该商品.');
        this.shareLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer', {
            height: 160
        });
        this.add(this.msgbox);
        //销毁的时候结束定时器
        this.on('destroy', this.onDestroy);
        this.down('tabpanel').on('activeitemchange', this.resizeContainer);
        //默认的itemtap在android下不能弹出keyboard，又是曲线救国
        this.handleItemTap();
    },

    resizeContainer: function(card, newItem) {
        var barHeight = card.down('tabbar').element.getHeight();
        contentElement = newItem.innerHtmlElement || newItem.element;
        var contentHeight = contentElement.getHeight();
        card.setHeight(contentHeight + barHeight);
    },

    handleItemTap: function() {
        var me = this;
        this.element.dom.addEventListener('click', function(e) {
            var row = Ext.fly(e.target).findParent('.comment-row');
            if (!row) return;
            var id = row.getAttribute('data-id');
            var index = me.getStore().indexOfId(id);
            var record = me.getStore().getAt(index);
            if (e.target.className == 'avatar') {
                me.fireEvent('avatartap', index, record);
                return false;
            }
            if (e.target.className == 'up') {
                me.fireEvent('uptap', index, record);
                return false;
            }
            if (e.target.className == 'comment') {
                me.fireEvent('commenttap', index, record);
                return false;
            }
        });
    },

    applyAuctionId: function(id) {
        //加载数据
        this.loadData(id);
        return id;
    },

    loadData: function(id) {
        this.down('comment').setAuctionId(id);
        var auction = WeiQuPai.model.Auction;
        auction.load(id, {
            scope: this,
            success: function(record, operation) {
                this.setContent(record.data);
                //添加数据到分享功能
                this.shareLayer.setShareData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    setContent: function(data) {
        //保存数据，为后面使用
        this.auctionData = data;
        //this.down('detailpicshow').setPicData(data.pic_url);
        this.down('#detailData').setData(data);
        this.down('#itemDesc').setData(data);
        this.resizeContainer(this.down('tabpanel'), this.down('tabpanel').getActiveItem());
        //this.createChart();
        //this.down('#countdown').setData(data);

        if (this.auctionData.brand) {
            this.down('#brandInfo').show();
        }
        //this.setCountdown();
    },


    //软刷新
    softRefresh: function() {
        //先确保清空定时器
        this.onDestroy();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/auction/refresh&id=' + this.auctionData.id,
            method: 'get',
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                this.auctionData.left_time = rsp.left_time;
                this.auctionData.status = rsp.status;
                this.auctionData.curr_round = rsp.curr_round;
                this.auctionData.curr_price = rsp.curr_price;
                this.auctionData.round_start_time = rsp.round_start_time;
                this.down('#countdown').setData(this.auctionData);
                //如果没结束就继续自动刷新
                if (rsp.status != WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                    Ext.get('paiBtnMask').setStyle('display', 'none');
                    this.setCountdown();
                } else {
                    Ext.get('paiBtnMask').setStyle('display', 'block');
                }
            },
            scope: this
        });
    },

    //设置定时器
    setCountdown: function() {
        var now = Math.ceil(new Date / 1000);
        this.leftSeconds = this.auctionData.left_time;
        if (this.leftSeconds <= 0 || this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) return;
        var me = this;
        //如果是未开始，在开始时间做软刷新
        if (this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
            this.refreshTimer = setTimeout(function() {
                me.softRefresh();
            }, this.leftSeconds * 1000);
            return;
        }
        //已经开始的做计时
        this.counterTimer = setInterval(function() {
            me.countdown();
        }, 1000);
    },

    countdown: function() {
        //计时结束做下一轮刷新
        if (this.leftSeconds == 0) {
            clearInterval(this.counterTimer);
            this.counterTimer = null;
            return this.softRefresh();
        }
        this.leftSeconds--;
        var sec = this.leftSeconds % 60;
        var min = (this.leftSeconds - sec) / 60;
        var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
        //android系统2秒才走一次定时器，加一个span标签就没问题了
        Ext.get('countdown').setHtml('<span>' + countdown + '</span>');

        var me = this;
        if (this.leftSeconds <= 6 && this.leftSeconds > 0) {
            setTimeout(function() {
                me.flashBackground();
            }, 700);
        }
    },

    flashBackground: function() {
        var me = this;
        var el = Ext.get('countdown');
        var outAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'background': '#ca0936'
            },
            to: {
                'background': '#f0f0f1'
            },
            duration: 200,
            after: function() {
                inAnim.run(el);
            }
        });
        var inAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'background': '#f0f0f1'
            },
            to: {
                'background': '#ca0936'
            },
            duration: 600
        });
        outAnim.run(el);
    },

    //价格趋势图
    createChart: function() {
        //显示趋势图
        var id = this.auctionData.id;
        var el = new Image;
        el.src = WeiQuPai.Config.host + '/apic/' + id + '.png?_dc=' + Math.random();
        var chart = this.down('#chart');
        chart.element.appendChild(el);
        el.onload = function() {
            chart.show();
        }
    },

    //销毁的时候清除定时器
    onDestroy: function() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        if (this.counterTimer) {
            clearInterval(this.counterTimer);
            this.counterTimer = null;
        }
    }
});