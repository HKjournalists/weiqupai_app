Ext.define('WeiQuPai.view.CategoryWithSearch', {
    extend: 'Ext.Container',
    requires: ['WeiQuPai.view.Category', 'WeiQuPai.view.SearchItem'],
    xtype: 'categorywithsearch',
    config: {
        cls: 'bg_ef',
        layout: 'vbox',
        items: [{
            xtype: 'vtitlebar',
            title: '商品分类',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
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
                placeHolder: '输入想要搜索的商品',
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
            xtype: 'container',
            layout: 'card',
            itemId: 'mainView',
            flex: 1,
            items: [{
                xtype: 'category'
            }, {
                xtype: 'searchitem'
            }]
        }]
    },

    initialize: function(){
        this.callParent(arguments);

        this.down('#cancelSearchBtn').on('tap', function(){
            this.down('#searchText').reset();
            this.down('searchitem').getStore().removeAll();
            this.down('#cancelSearchBtn').hide();
            this.down('#mainView').setActiveItem('category');
        }, this);

        this.down('#searchBtn').on('tap', this.doSearch, this);
        this.down('#searchText').on('keyup', function(input, e){
            this.down('#cancelSearchBtn')[input.getValue().trim().length > 0 ? 'show' : 'hide']();
            if(e.browserEvent.keyCode == 13){
                e.preventDefault();
                this.doSearch();
            }
        }, this);
    }, 

    //搜索
    doSearch: function(){
        var v = this.down('#searchText').getValue().trim();
        if(v.length == 0) return;
        this.down('searchitem').setWord(v);
        var me = this;
        this.down('searchitem').loadData(function(){
            me.down('#mainView').setActiveItem('searchitem');
        });
    }
})