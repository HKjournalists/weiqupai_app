/**
 * 单个评论的详情
 */
Ext.define('WeiQuPai.view.Comment', {
    extend: 'Ext.DataView',
    xtype: 'comment',
    requires: ['WeiQuPai.view.DeleteButtonLayer'],
    config: {
        commentId: null,
        commentRecord: null,
        cls: 'bg_ef',
        loadingText: null,
        scrollToTopOnRefresh: false,
        store: 'CommentReply',
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
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="message_new" data-id="{id}">',
            '<div class="msg-reply re_message">',
            '<div class="dis">',
            '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="30"></div>',
            '<div class="name"><b>{user.nick}</b>:{content:htmlEncode}</div>',
            '<div style="clear:both"></div>',
            '<div class="date"><tpl if="this.isSelf(uid)"><span class="delete-reply-btn">删除</span></tpl>{ctime}</div>',
            '</div>',

            '</div>',
            '</div>', {
                isSelf: function(uid) {
                    var user = WeiQuPai.Cache.get('currentUser');
                    if (!user) return false;
                    return user.id == uid;
                },
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '评论详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'comment',
            cls: 'feed discard remess',
            tpl: new Ext.XTemplate(
                '<div class="confirm">',
                '<div class="confirm_w"><div class="confirm_title">',
                '<img src="{[this.getPic(values.item.pic_cover)]}"}" class="card-img"/>',
                '<div class="title">{item.title}</div>',
                '<div style="clear:both"></div>',
                '</div></div>',

                '<div class="list">',

                '<div class="one">',
                '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="40" class="avatar-img"></div>',
                '<div class="name"><b>{user.nick}</b>:<span class="color_38">{content:htmlEncode}</span></div>',
                '</div>',

                '<div class="date">',
                '<div class="left">{ctime}</div>',
                '<div class="right">',
                '<div class="comment">{reply_num}</div>',
                '<div class="{[this.getZanCls(values)]}">{zan_num}</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>',

                '</div></div>', {
                    isSelf: function(uid) {
                        var user = WeiQuPai.Cache.get('currentUser');
                        if (!user) return false;
                        return user.id == uid;
                    },
                    getAvatar: function(avatar) {
                        return WeiQuPai.Util.getAvatar(avatar, 140);
                    },
                    getShowOrderPic: function(pic) {
                        return WeiQuPai.Util.getImagePath(pic);
                    },
                    getPic: function(pic) {
                        return WeiQuPai.Util.getImagePath(pic, 200);
                    },
                    getZanCls: function(values) {
                        return WeiQuPai.Util.hasCache('comment_zan', parseInt(values.id)) ? 'selflike' : 'like';
                    }
                }
            )
        }, {
            xtype: 'container',
            itemId: 'zanList',
            tpl: new Ext.XTemplate(
                '<div class="msg-zan">',
                '<tpl if="zan.length"><div class="title">',
                '<tpl for="zan"><img src="{[this.getAvatar(values.avatar)]}" class="zan_avatar" data-uid="{id}"/></tpl>',
                '</div></tpl>',
                '</div>', {
                    getAvatar: function(avatar) {
                        return WeiQuPai.Util.getAvatar(avatar, 140);
                    },
                }
            )
        }, {
            xtype: 'inputcomment',
            itemId: 'reply',
            docked: 'bottom'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.handleItemTap();
        this.down('#comment').on('tap', this.bindFeedEvent, this, {
            element: 'element'
        });
        this.down('#zanList').on('tap', this.bindFeedEvent, this, {
            element: 'element'
        })
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

    updateCommentId: function(fid) {
        this.loadData();
    },

    updateReplyData: function(field, value) {
        var data = this.down('#comment').getData();
        data[field] = parseInt(data[field]) + value;
        this.down('#comment').setData(data);
        this.getCommentRecord().set(field, data[field]);
    },

    updateZanData: function(value) {
        var user = WeiQuPai.Cache.get('currentUser');
        this.updateReplyData('zan_num', value);
        var data = this.down('#zanList').getData();
        if (value > 0) {
            var d = {
                id: user.id,
                nick: user.nick,
                avatar: user.avatar
            }
            data.zan.push(d);
        } else {
            for (var i = 0; i < data.zan.length; i++) {
                if (data.zan[i].id == user.id) {
                    data.zan.splice(i, 1);
                    break;
                }
            }
        }
        this.down('#zanList').setData(data);
    },

    applyCommentRecord: function(record) {
        if (record == null) {
            return;
        }
        var data = record.data;
        this.down('#comment').setData(data);
        this.down('#zanList').setData(data);
        return record;
    },

    loadData: function(callback) {
        var cid = this.getCommentId();
        var user = WeiQuPai.Cache.get('currentUser');
        var query = WeiQuPai.Util.getDefaultParam();
        var cmt = WeiQuPai.model.Comment;
        cmt.getProxy().setExtraParams(query);
        cmt.load(cid, {
            scope: this,
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            },
            success: function(record, operation) {
                this.setCommentRecord(record);
                this.getStore().setData(record.get('replies'));
                Ext.isFunction(callback) && callback();
            }
        });
    },

    handleItemTap: function() {
        if (Ext.os.is.ios) {
            this.on('itemtap', function(list, index, dataItem, record, e) {
                this.bindEvent(index, record, e);
            });
        } else {
            var me = this;
            this.element.dom.addEventListener('click', function(e) {
                var row = Ext.get(e.target).findParent('.message_new');
                if (!row) return;
                var id = row.getAttribute('data-id');
                var index = me.getStore().indexOfId(id);
                var record = me.getStore().getAt(index);
                me.bindEvent(index, record, e);
            });
        }
    },

    bindEvent: function(index, record, e) {
        var me = this;
        var user = WeiQuPai.Cache.get('currentUser');
        if (Ext.get(e.target).findParent('.avatar')) {
            me.fireEvent('avatartap', me, index, record);
            return false;
        }

        if (e.target.className == 'delete-reply-btn') {
            me.fireEvent('deletereply', me, index, record);
            return false;
        }
        me.fireEvent('replytap', me, index, record);
    },

    bindFeedEvent: function(e) {
        var me = this;
        if (Ext.get(e.target).findParent('.avatar-img')) {
            me.fireEvent('feedavatartap', me);
            return false;
        }
        var el = Ext.get(e.target).findParent('.zan_avatar');
        if (el) {
            var uid = el.getAttribute('data-uid');
            me.fireEvent('zanavatartap', me, uid);
            return false;
        }
        if (Ext.get(e.target).findParent('.like')) {
            me.fireEvent('zan', me);
            return false;
        }
        if (Ext.get(e.target).findParent('.selflike')) {
            me.fireEvent('cancelzan', me);
            return false;
        }
        //卡片点击
        if (Ext.get(e.target).up('.confirm_title')) {
            me.fireEvent('cardtap', me);
            return false;
        }
    }
});