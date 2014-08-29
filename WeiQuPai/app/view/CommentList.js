Ext.define('WeiQuPai.view.CommentList', {
    extend: 'Ext.DataView',
    xtype: 'commentlist',
    requires: ['WeiQuPai.view.Comment'],
    config: {
        itemId: null,
        scrollable: null,
        store: 'Comment',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        cls: 'discard',
        style: 'min-height:180px',
        itemTpl: new Ext.XTemplate(
            '<div class="list" data-id="{id}">',
            '<div class="one">',
            '<div class="img">',
            '<img src="{[WeiQuPai.Util.getAvatar(values.user.avatar, 140)]}" width="40">',
            '</div>',
            '<div class="name">{user.nick:htmlEncode}</div>',
            '</div>',
            '<div class="dis">{content:htmlEncode}</div>',
            '<div class="date">',
            '<div class="left">{ctime} <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
            '<div class="right">',
            '<div class="comment">{reply_num}</div>',
            '<div class="{[this.getZanCls(values)]}">{zan_num}</div>',
            '</div>',
            '</div>',
            '</div>', {
                getZanCls: function(values) {
                    var id = parseInt(values.id);
                    return WeiQuPai.Util.hasCache('comment_zan', id) ? 'selflike' : 'like';
                },
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                }
            }
        ),
        items: [{
            xtype: 'container',
            layout: 'hbox',
            scrollDock: 'top',
            items: [{
                xtype: 'container',
                flex: 1
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'spacer',
                cls: 'detail_listOne',
                flex: 1
            }]
        }],

        loadMoreCmp: null,
        isFullyLoaded: false
    },

    //没有内容的占位容器
    msgbox: null,

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
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);
        //默认的itemtap在android下不能弹出keyboard，又是曲线救国
        this.handleItemTap();

        var cmp = Ext.create('Ext.Component', this.loadCmpCfg);
        this.setLoadMoreCmp(cmp);
        this.add(this.getLoadMoreCmp());
    },

    handleItemTap: function() {
        var me = this;
        if (Ext.os.is.android) {
            this.element.dom.addEventListener('click', function(e) {
                var row = Ext.fly(e.target).findParent('.list');
                if (!row) return;
                var id = row.getAttribute('data-id');
                var index = me.getStore().indexOfId(id);
                var record = me.getStore().getAt(index);
                me.bindEvent(index, record, e);
            });
        } else {
            this.on('itemtap', function(list, index, dataItem, record, e) {
                this.bindEvent(index, record, e);
            });
        }
    },

    bindEvent: function(index, record, e) {
        var me = this;
        if (e.target.tagName.toLowerCase() == 'img') {
            me.fireEvent('avatartap', index, record);
            return false;
        }
        if (e.target.className == 'like') {
            me.fireEvent('zantap', index, record);
            return false;
        }
        if (e.target.className == 'selflike') {
            me.fireEvent('cancelzantap', index, record);
            return false;
        }
        if (e.target.className == 'delete-post-btn') {
            me.fireEvent('deletepost', me, index, record);
            return false;
        }
        me.fireEvent('commenttap', index, record);
    },

    applyItemId: function(itemId) {
        this.loadData(itemId);
    },

    loadData: function(itemId) {
        this.setLoadingText(null);
        var store = this.getStore();
        store.removeAll(true);
        store.getProxy().setExtraParam('item_id', itemId);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('评论加载失败');
                return;
            }
            if (records.length == 0) {
                this.msgbox.show();
            }
            if (records.length < store.getPageSize()) {
                this.setIsFullyLoaded(true);
                this.getLoadMoreCmp().hide();
            } else {
                this.setIsFullyLoaded(false);
            }
        }, this);
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