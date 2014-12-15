Ext.define('WeiQuPai.view.MyFollowTab', {
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.MyFollow', 'WeiQuPai.view.MyFans', 'WeiQuPai.view.SearchUser'],
    xtype: 'myfollowtab',
    config: {
        uid: null,
        cls: 'bg_ef',
        layout: 'vbox',
        items: [{
            xtype: 'vtitlebar',
            title: '我的关注',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'formpanel',
            scrollable: false,
            layout: 'hbox',
            baseCls: 'search',
            items: [{
                flex: 1,
                xtype: 'searchfield',
                itemId: 'searchText',
                placeHolder: '输入想要搜索的用户名',
                clearIcon: false
            }, {
                xtype: 'button',
                itemId: 'searchBtn',
                baseCls: 'btn_search',
            }, {
                xtype: 'button',
                itemId: 'cancelSearchBtn',
                baseCls: 'text-btn',
                text: '取消',
                hidden: true
            }]
        }, {
            xtype: "container",
            layout: 'hbox',
            cls: 'fans_tabbar',
            itemId: 'tabButton',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '我的关注',
                action: 'myfollow',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                text: '我的粉丝',
                action: 'myfans'
            }]
        }, {
            xtype: 'container',
            layout: 'card',
            itemId: 'mainView',
            flex: 1,
            items: [{
                xtype: 'myfollow'
            }, {
                xtype: 'myfans'
            }, {
                xtype: 'searchuser'
            }]
        }]
    },

    activeTab: null,

    updateUid: function(uid){
        this.down('myfollow').setUid(uid);
        this.down('myfans').setUid(uid);
    },

    initialize: function(){
        this.callParent(arguments);
        this.setUid(WeiQuPai.Cache.get('currentUser').id);

        this.down('#cancelSearchBtn').on('tap', function(){
            this.down('#searchText').reset();
            this.down('searchuser').getStore().removeAll();
            this.down('#tabButton').show();
            this.down('#cancelSearchBtn').hide();
            this.down('#mainView').setActiveItem(this.activeTab.config.action);
        }, this);

        this.down('#searchBtn').on('tap', this.doSearch, this);
        this.down('#searchText').on('keyup', function(input, e){
            this.down('#cancelSearchBtn')[input.getValue().trim().length > 0 ? 'show' : 'hide']();
            if(e.browserEvent.keyCode == 13){
                e.preventDefault();
                this.doSearch();
            }
        }, this);

        var btns = this.query('#tabButton button');
        this.activeTab = btns[0];
        var main = this.down('#mainView');
        var self = this;
        for(var i=0; i<btns.length; i++){
            btns[i].on('tap', function(btn){
                if(self.activeTab == this){
                    return;
                }
                this.addCls('x-button-active');
                main.setActiveItem(this.config.action);
                self.activeTab.removeCls('x-button-active');
                self.activeTab = this;
            });
        }
    }, 

    //搜索
    doSearch: function(){
        var v = this.down('#searchText').getValue().trim();
        if(v.length == 0) return;
        this.down('searchuser').setWord(v);
        var me = this;
        this.down('searchuser').loadData(function(){
            me.down('#mainView').setActiveItem('searchuser');
            me.down('#tabButton').hide();
        });
    }
})