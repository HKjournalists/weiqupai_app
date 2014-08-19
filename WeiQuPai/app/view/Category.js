Ext.define('WeiQuPai.view.Category', {
    extend: 'Ext.DataView',
    xtype: 'category',
    requires: ['WeiQuPai.view.CategoryItem'],
    config: {
        cls: 'bg_ef listting',
        store: 'Category',
        items: [{
            xtype: 'vtitlebar',
            title: '商品分类',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }],
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
        this.getStore().load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
        }, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).hasCls('btn_e7')) {
            var id = e.target.getAttribute('data-id');
            var view = Ext.create('WeiQuPai.view.CategoryItem');
            view.setCategoryId(id);
            view.setCategoryTitle(e.target.value)
            WeiQuPai.navigator.push(view);
        }
    }
});