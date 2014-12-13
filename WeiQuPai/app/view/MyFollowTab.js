Ext.define('vqp.view.MyFollowTab', {
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.MyFollow', 'WeiQuPai.view.MyFans'],
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
            xtype: 'container',
            layout: 'hbox',
            cls: 'search',
            items: [{
                flex: '1',
                xtype: 'searchfield',
                name: 'searchText',
                placeHolder: '输入想要搜索的用户名',
                style: 'border:0px;'
            }, {
                width: '100',
                xtype: 'button',
                baseCls: 'btn_search',
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
                action: 'tab_care',
                itemId: 'tab_care',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                text: '我的粉丝',
                action: 'tab_fan',
                itemId: 'tab_fan'
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
                main.setActiveItem('#' + this.config.action);
                self.activeTab.removeCls('x-button-active');
                self.activeTab = this;
            });
        }
    }
})