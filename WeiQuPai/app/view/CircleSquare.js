/**
 * 拍圈广场
 */
Ext.define('WeiQuPai.view.CircleSquare', {
    extend: 'WeiQuPai.view.FeedList',
    xtype: 'circlesquare',
    config: {
        store: 'Circle'
    },

    initialize: function() {
        this.callParent(arguments);
    }
});