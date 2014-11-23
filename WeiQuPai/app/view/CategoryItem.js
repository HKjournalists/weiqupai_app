Ext.define('WeiQuPai.view.CategoryItem', {
    extend: 'Ext.DataView',
    xtype: 'categoryitem',
    config: {
        cls: 'bg_ef cateogry-item-container',
        store: 'CategoryItem',
        loadingText: null,
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
        items: [{
            xtype: 'vtitlebar',
            title: '分类名称',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }],
        itemCls: 'category-item',
        itemTpl: new Ext.XTemplate(
            '<div class="item">',
            '<div class="pic" style="background-image:url({[WeiQuPai.Util.getImagePath(values.pic_cover, 200)]})"></div>',
            '<div class="title">{title}</div>',
            '</div>'
        ),

        categoryId: null,
        categoryTitle: null
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.showItem, this);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);
    },

    updateCategoryTitle: function(title) {
        this.down('vtitlebar').setTitle(title);
    },

    updateCategoryId: function(id) {
        this.loadData();
    },

    loadData: function() {
        this.getStore().getProxy().setExtraParam('id', this.getCategoryId());
        this.getStore().loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
        }, this);
    },

    showItem: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('id'));
    }
})