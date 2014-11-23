/**
 * 拍圈广场
 */
Ext.define('WeiQuPai.view.FeedList', {
    extend: 'Ext.DataView',
    requires: ['WeiQuPai.view.CircleReplyLayer', 'WeiQuPai.view.Feed'],
    xtype: 'feedlist',
    config: {
        cls: 'bg_ef discard remess paiquan',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        scrollable: null,
        store: 'Circle',
        itemTpl: new Ext.XTemplate(
            '<div class="list circle-row" data-id="{id}">',
            '<div class="one">',
            '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="40"></div>',
            '<div class="name">',
            '<tpl if="feed_type==0">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 发表了一条消息</span></div>',
            '<div class="feed-content">{content:htmlEncode}</div>',

            '<tpl elseif="feed_type==1">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 发表了一个晒单</span></div>',
            '<div class="color_38">{content:htmlEncode}</div>',
            '<div class="pic-group-list"><tpl for="json_data.pic_list"><img src="{[this.getShowOrderPic(values)]}" data-idx="{#}" class="pic-list-img"/></tpl></div>',
            '<div class="confirm_w"><div class="confirm_title">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
            '<div class="title">{json_data.title}</div>',
            '<div style="clear:both"></div>',
            '</div></div>',

            '<tpl elseif="feed_type==2">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 拍下了一个宝贝</span></div>',
            '<div class="feed-content">{content:htmlEncode}</div>',
            '<div class="confirm_w"><div class="confirm_title">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
            '<div class="title">{json_data.title}</div>',
            '<div style="clear:both"></div>',
            '</div></div>',

            '<tpl elseif="feed_type==3">',
            '<div class="feed-title"><b>{user.nick}</b><span class="color_85"> 创建了血战到底</span></div>',
            '<div class="feed-content">',
            '<span class="help_btn">帮杀</span>',
            '<span class="auction_btn">观战</span>',
            '<span class="kill_btn">参战</span>',
            '</div>',
            '<div class="confirm_w"><div class="confirm_title">',
            '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
            '<div class="title">{json_data.title}</div>',
            '<div style="clear:both"></div>',
            '</div></div>',
            '</tpl>',

            '<div class="date">',
            '<div class="left">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
            '<div class="right">',
            '<div class="comment">{reply_num}</div>',
            '<div class="{[this.getZanCls(values)]}">{zan_num}</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>',

            '</div>',
            '</div>',
            '</div>', {
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                },
                getZanCls: function(values) {
                    return WeiQuPai.Util.hasCache('circle_zan', values.id) ? 'selflike' : 'like';
                },
                getPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, 200);
                },
                getShowOrderPic: function(pic) {
                    return WeiQuPai.Util.getImagePath(pic, 150);
                },
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),

        loadMoreCmp: null,
        isFullyLoaded: false
    },

    loadCmpCfg: {
        baseCls: 'x-list-paging',
        html: [
            '<div class="x-loading-spinner" style="font-size: 20px; margin: 0px auto;">',
            '<span class="x-loading-top"></span>',
            '<span class="x-loading-right"></span>',
            '<span class="x-loading-bottom"></span>',
            '<span class="x-loading-left"></span>',
            '</div>'
        ].join('')
    },

    initialize: function() {
        this.callParent(arguments);
        
        var cmp = Ext.create('Ext.Component', this.loadCmpCfg);
        this.setLoadMoreCmp(cmp);
        this.add(this.getLoadMoreCmp());

        this.loadData();
        this.handleItemTap();
    },

    loadData: function(callback) {
        if (this.getStore().isLoading()) {
            return false;
        }
        this.setLoadingText(null);
        var user = WeiQuPai.Cache.get('currentUser');
        this.getStore().getProxy().setExtraParam('token', user && user.token || null);
        this.getStore().loadPage(1, function(records, operation, success){
            callback && callback.apply(null, arguments);
        });
    },

    handleItemTap: function() {
        this.on('itemtap', function(list, index, dataItem, record, e) {
            this.bindEvent(index, record, e);
        });
        //按钮的状态事件
        this.onBefore('itemtouchstart', function(list, index, dataItem, record, e) {
            if (/(help|auction|kill)_btn/.test(e.target.className)) {
                Ext.get(e.target).addCls('active');
                return false;
            }
        }, this);
        this.onBefore('itemtouchend', function(list, index, dataItem, record, e) {
            if (/(help|auction|kill)_btn/.test(e.target.className)) {
                Ext.get(e.target).removeCls('active');
                return false;
            }
        }, this);
    },

    bindEvent: function(index, record, e) {
        var me = this;
        var user = WeiQuPai.Cache.get('currentUser');
        if (Ext.get(e.target).findParent('.avatar')) {
            me.fireEvent('avatartap', me, index, record);
            return false;
        }

        //卡片点击
        var card = Ext.get(e.target).findParent('.confirm_title');
        if (card) {
            me.fireEvent('cardtap', me, index, record);
            return false;
        }

        if (e.target.className == 'delete-post-btn') {
            me.fireEvent('deletepost', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.like')) {
            me.fireEvent('zan', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.selflike')) {
            me.fireEvent('cancelzan', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.pic-list-img')) {
            var picIdx = e.target.getAttribute('data-idx');
            me.fireEvent('pictap', me, index, record, picIdx);
            return false;
        }
        if (Ext.get(e.target).findParent('.help_btn')) {
            me.fireEvent('helptap', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.auction_btn')) {
            me.fireEvent('auctiontap', me, index, record);
            return false;
        }
        if (Ext.get(e.target).findParent('.kill_btn')) {
            me.fireEvent('killtap', me, index, record);
            return false;
        }
        me.fireEvent('feedtap', me, index, record);
    },

    nextPage: function(scroller) {
        var store = this.getStore();
        if (store.isLoading() || this.getIsFullyLoaded()) {
            return;
        }
        var loadCmp = this.getLoadMoreCmp();
        loadCmp.addCls('x-loading');
        loadCmp.show();

        store.nextPage({
            addRecords: true,
            scope: this,
            callback: function(records, operation, success) {
                loadCmp.removeCls('x-loading');
                if (records.length < store.getPageSize()) {
                    this.setIsFullyLoaded(true);
                    scroller.on({
                        scrollend: function() {
                            loadCmp.hide();
                            scroller.refresh();
                        },
                        single: true
                    });
                    var offset = -loadCmp.element.getHeight();
                    scroller.scrollBy(null, offset, {
                        duration: 300
                    });
                }
                if (!success) {
                    return WeiQuPai.Util.toast('数据加载失败');
                }
            }
        })
    }
});