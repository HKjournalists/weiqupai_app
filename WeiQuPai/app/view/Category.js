Ext.define('WeiQuPai.view.Category', {
    extend: 'Ext.DataView',
    xtype: 'category',
    requires: ['WeiQuPai.view.CategoryItem'],
    config: {
        cls: 'bg_ef listting',
        store: 'Category',
        itemTpl: new Ext.XTemplate(
            '<div class="product">',
            '<div class="todayTitle">{title}</div>',
            '<div class="mulu">',
            '<ul><tpl for="childs"><li><input type="button" value="{title}" class="cate_btn" data-id="{id}"/></li></tpl></ul>',
            '<div class="clear"></div>',
            '</div>',
            '</div>'
        )
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.bindEvent, this);
        this.loadData();
    },

    loadData: function() {
        var query = WeiQuPai.Util.getDefaultParam();
        this.getStore().getProxy().setExtraParams(query);
        this.getStore().load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).hasCls('cate_btn')) {
            var id = e.target.getAttribute('data-id');
            var view = Ext.create('WeiQuPai.view.CategoryItem');
            view.setCategoryId(id);
            view.setCategoryTitle(e.target.value)
            WeiQuPai.navigator.push(view);
        }
    }
});