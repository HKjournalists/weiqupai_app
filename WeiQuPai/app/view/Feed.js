/**
 * 单个feed的回复
 */
Ext.define('WeiQuPai.view.Feed', {
    extend: 'Ext.DataView',
    xtype: 'feed',
    config: {
        feedId: null,
        cls: 'bg_ef',
        loadingText: null,
        disableSelection: true,
        store: 'FeedReply',
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
            '<div class="message_new">',
            '<div class="msg-reply re_message">',
            '<div class="dis">',
            '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="30"></div>',
            '<div class="name"><b>{user.nick}</b><tpl if="to_nick">回复<b>{to_nick}</b></tpl>:{content:htmlEncode}</div>',
            '<div style="clear:both"></div>',
            '<div class="date">{ctime}  <tpl if="this.isSelf(uid)"><span class="delete-post-btn">删除</span></tpl></div>',
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
            title: '动态详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'feed',
            cls: 'feed discard remess',
            tpl: new Ext.XTemplate(
                '<div class="confirm">',
                '<div class="confirm_w"><div class="confirm_title">',
                '<img src="{[this.getPic(values.json_data.pic_cover)]}"}" class="card-img"/>',
                '<div class="title">{json_data.title}</div>',
                '<div style="clear:both"></div>',
                '</div></div>',

                '<div class="list">',

                '<div class="one">',
                '<div class="img avatar"><img src="{[this.getAvatar(values.user.avatar)]}" width="40"></div>',
                '<div class="name"><b>{user.nick}</b>:<span class="color_38">{content:htmlEncode}</span>',
                '<div class="pic-group-list"><tpl for="json_data.pic_list"><img src="{[this.getShowOrderPic(values)]}" data-idx="{#}"/></tpl></div>',
                '</div>',
                '</div>',

                '<div class="date">',
                '<div class="left">{ctime}</div>',
                '<div class="right">',
                '<div class="comment">{reply_num}</div>',
                '<div class="like">{zan_num}</div>',
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
                        return WeiQuPai.Util.getImagePath(pic, 100);
                    }
                }
            )
        }, {
            xtype: 'container',
            itemId: 'zanList',
            tpl: new Ext.XTemplate(
                '<div class="msg-zan"><div class="title">',
                '<tpl for="zan"><img src="{[this.getAvatar(values.avatar)]}" class="zan_avatar" data-uid="{id}"/></tpl>',
                '</div>', {
                    getAvatar: function(avatar) {
                        return WeiQuPai.Util.getAvatar(avatar, 140);
                    },
                }
            )
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.handleItemTap();
    },

    updateFeedId: function(fid) {
        this.loadData();
    },

    loadData: function() {
        var fid = this.getFeedId();
        var user = WeiQuPai.Cache.get('currentUser');
        var feed = WeiQuPai.model.Feed;
        feed.getProxy().setExtraParam('token', user && user.token || '');
        feed.load(fid, {
            scope: this,
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            },
            success: function(record, operation) {
                this.down('#feed').setRecord(record);
                this.down('#zanList').setRecord(record);
                this.getStore().setData(record.get('replies'));
            },
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
                var row = Ext.fly(e.target).up('.circle-row');
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
        if (e.target.className == 'uname') {
            var uid = e.target.getAttribute('uid');
            me.fireEvent('usertap', me, index, record, uid);
            return false;
        }

        / /
        卡片点击
        var card = Ext.get(e.target).up('.card');
        if (card) {
            me.fireEvent('cardtap', me, index, record, card.getAttribute('dataType'));
            return false;
        }

        //下面的事件都是登录后才会触发的
        if (!user) return false;

        if (e.target.className == 'delete-post-btn') {
            me.fireEvent('deletepost', me, index, record);
            return false;
        }
        if (e.target.className == 'zan-btn' || e.target.parentNode.className == 'zan-btn') {
            me.fireEvent('zan', me, index, record);
            return false;
        }
        if (e.target.className == 'cancel-zan-btn' || e.target.parentNode.className == 'cancel-zan-btn') {
            me.fireEvent('cancelzan', me, index, record);
            return false;
        }
        if (e.target.className == 'reply-btn' || e.target.parentNode.className == 'reply-btn') {
            me.fireEvent('replytap', me, index, record, 0, null);
            return false;
        }
        if (e.target.className == 'reply-row') {
            var toUid = e.target.getAttribute('uid');
            //删除自己的回复事件
            if (toUid == user.id) {
                me.fireEvent('deletereply', me, index, record, e.target.getAttribute('rid'));
                return false;
            }
            //回复事件
            var toUser = e.target.getAttribute('nick');
            me.fireEvent('replytap', me, index, record, toUid, toUser);
            return false;
        }
    }
});