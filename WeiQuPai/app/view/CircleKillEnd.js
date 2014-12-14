/**
 * 拍圈广场
 */
Ext.define('WeiQuPai.view.CircleKillEnd', {
    extend: 'WeiQuPai.view.FeedList',
    xtype: 'circlekillend',
    config: {
        store: 'CircleKillEnd'
    },

    initialize: function() {
        this.callParent(arguments);
    }
});